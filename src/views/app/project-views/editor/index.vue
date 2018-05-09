<script>
import _ from 'lodash'
import Api from '@/api'
import moment from 'moment'
import { mapState } from 'vuex'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import ToolbarComponent from './toolbar'
import Quill from 'quill'
import DocumentModel from '@/models/document'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

const EDITOR_MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}
const EMPTY_DOCUMENT = {
  title: '',
  subtitle: '',
  content: '',
  quill_delta: {},
  is_draft: false
}
const FIELDS_TO_TRACK = ['title', 'subtitle', 'content', 'is_draft']
const DEBOUNCE_TIME = 10000 // Save changes after 10 seconds of typing
const DEBOUNCE_OPTIONS = { maxWait: 120000 } // Ensure that saving is being performed every 2 minutes

export default {
  name: 'kms-app-project-editor-page',
  props: {
    'documentslug': String
  },
  mixins: [TextFiltersMixin, DateFiltersMixin],
  components: {
    'kms-quill-toolbar': ToolbarComponent
  },
  data: () => ({
    EDITOR_MODE,
    editorInstance: null,
    selectionFormats: null,

    isDocumentLoading: false,
    isDocumentSaving: false,
    lastSaveTime: null,

    keysEventListener: null,

    document: null,
    documentCache: _.assign({}, EMPTY_DOCUMENT)
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme,
      'project': s => s.ProjectSingle.project
    }),
    containerClass () {
      return this.darkTheme ? ['grey', 'darken-4'] : ['grey', 'lighten-4']
    },
    editorMode () {
      return _.defaultTo(this.$route.meta.editorMode, EDITOR_MODE.EDIT)
    },
    documentChanged () {
      var compareWith = this.document || EMPTY_DOCUMENT
      return _.some(FIELDS_TO_TRACK, (field) => !_.isEqual(this.documentCache[field], compareWith[field]))
    },

    titleErrors () {
      const errors = []
      if (!this.$v.documentCache.title.$dirty) return errors
      !this.$v.documentCache.title.required && errors.push('You must specify title')
      !this.$v.documentCache.title.maxLength && errors.push('Title is too long')
      !this.$v.documentCache.title.minLength && errors.push('Title must be at least 3 characters')
      return errors
    },
    subtitleErrors () {
      const errors = []
      if (!this.$v.documentCache.subtitle.$dirty) return errors
      !this.$v.documentCache.subtitle.maxLength && errors.push('Subtitle is too long')
      return errors
    }
  },

  validations: {
    documentCache: {
      title: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(255)
      },
      subtitle: {
        maxLength: maxLength(255)
      }
    }
  },

  watch: {
    editorMode (mode, oldMode) {
      if (mode === EDITOR_MODE.EDIT) {
        if (oldMode !== EDITOR_MODE.CREATE) {
          this.fetch()
        }
      } else {
        this.resetDocument()
      }
    },
    documentCache: {
      deep: true,
      handler: function () {
        if (this.documentChanged) {
          this.autoSave()
        }
      }
    }
  },

  methods: {
    initEditor () {
      if (this.editorInstance) {
        return
      }

      this.editorInstance = new Quill(this.$refs.editor, {
        placeholder: 'Compose an epic...'
      })

      this.editorInstance.on('editor-change', (event, ...args) => {
        if (event === 'selection-change' && args[0]) {
          this.selectionFormats = this.editorInstance.getFormat(args[0])
        }
      })

      this.editorInstance.on('text-change', (delta) => {
        this.documentCache.quill_delta = this.editorInstance.getContents()
        this.documentCache.content = this.editorInstance.root.innerHTML
      })
    },
    setFormat ({ format, value }) {
      this.editorInstance.format(format, value)
      var currentSelection = this.editorInstance.getSelection()
      if (currentSelection) {
        this.selectionFormats = this.editorInstance.getFormat()
      }
    },
    clearFormat () {
      var currentSelection = this.editorInstance.getSelection()
      if (currentSelection) {
        this.editorInstance.removeFormat(currentSelection.index, currentSelection.length)
      }
    },

    resetDocument () {
      this.document = null
      this.documentCache = _.assign({}, EMPTY_DOCUMENT)
    },
    fetch () {
      this.isDocumentLoading = true
      Api.documents.getSingle({ id: this.documentslug, quill: true }).then((response) => {
        this.isDocumentLoading = false
        this.document = (new DocumentModel(response.data)).toJSON()
        this.documentCache = _.assign({}, this.documentCache, this.document)

        try {
          this.editorInstance.setContents(JSON.parse(this.document.quill_delta))
        } catch (error) {
          throw new Error('Error parsing server response')
        }
      }).catch(info => {
        this.isDocumentLoading = false
        this.$notify.error('Error occured while loading document: ' + info.toString())
      })
    },

    async save () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      if (this.editorMode === EDITOR_MODE.CREATE) {
        await this.createDocument()
      } else if (this.editorMode === EDITOR_MODE.EDIT) {
        await this.updateDocument()
      }

      this.lastSaveTime = moment()
    },
    createDocument () {
      this.isDocumentSaving = true

      var model = _.assign({}, this.documentCache, {
        project_id: this.project.project_id
      })
      if (_.has(model, 'quill_delta')) {
        model.quill_delta = JSON.stringify(model.quill_delta)
      }

      return Api.documents.create(model).then((response) => {
        this.isDocumentSaving = false
        this.document = (new DocumentModel(response.data)).toJSON()
        this.$router.replace({
          name: 'Document-edit',
          params: _.assign({}, this.$route.params, { documentslug: this.document.slug })
        })
      }).catch(info => {
        this.isDocumentSaving = false
        this.$notify.error('Error creating document: ' + info.toString())
      })
    },
    async updateDocument () {
      this.isDocumentSaving = true

      try {
        if (!_.isEqual(this.documentCache.content, this.document.content)) {
          await Api.documents.saveChanges({
            id: this.document.document_id,
            model: {
              content: this.documentCache.content,
              quill_delta: JSON.stringify(this.documentCache.quill_delta)
            }
          })
        }

        var response = await Api.documents.update({
          id: this.document.document_id,
          model: _.omit(this.documentCache, ['content', 'quill_delta'])
        })

        this.document = (new DocumentModel(response.data)).toJSON()
        if (this.documentslug !== this.document.slug) {
          this.$router.replace({
            name: 'Document-edit',
            params: _.assign({}, this.$route.params, { documentslug: this.document.slug })
          })
        }
      } catch (info) {
        this.$notify.error('Error occured while saving changes: ' + info.toString())
      }

      this.isDocumentSaving = false
    },

    // Automatically track and save changes
    autoSave: _.debounce(function () {
      if (this.documentChanged) {
        this.save()
      }
    }, DEBOUNCE_TIME, DEBOUNCE_OPTIONS)
  },

  mounted () {
    var vm = this

    this.initEditor()
    if (this.editorMode === EDITOR_MODE.EDIT) {
      this.fetch()
    }

    this.keysEventListener = function (e) {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault()
        vm.save()
      }
    }

    document.addEventListener('keydown', this.keysEventListener, false)
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.keysEventListener)
  }
}
</script>
<template src="./template.html"></template>
<style src="./style.css"></style>
