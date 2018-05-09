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

const EDITOR_MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}
const EMPTY_DOCUMENT = {
  title: '',
  subtitle: '',
  content: '',
  quill_delta: '',
  is_draft: false
}
const FIELDS_TO_TRACK = ['title', 'subtitle', 'content', 'is_draft']
const DEBOUNCE_TIME = 30000 // Save changes after 30 seconds of typing
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
    documentCache () {
      if (this.documentChanged) {
        this.autoSave()
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
      Api.documents.getSingle({ id: this.documentslug }).then((response) => {
        this.isDocumentLoading = false
        this.document = (new DocumentModel(response.data)).toJSON()
        this.documentCache = _.assign({}, this.documentCache, this.document)
      }).catch(info => {
        this.isDocumentLoading = false
        this.$notify.error('Error occured while loading document: ' + info.toString())
      })
    },

    async save () {
      if (this.editorMode === EDITOR_MODE.CREATE) {
        await this.createDocument()
      } else if (this.editorMode === EDITOR_MODE.EDIT) {
        await this.updateDocument()
      }

      this.lastSaveTime = moment()
    },
    createDocument () {
      this.isDocumentSaving = true
      return Api.documents.create(_.assign({}, this.documentCache, {
        project_id: this.project.project_id
      })).then((response) => {
        this.isDocumentSaving = false
        this.document = (new DocumentModel(response.data)).toJSON()
        this.$router.replace({ name: 'Document-edit', params: { documentslug: document.slug } })
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
              quill_delta: this.documentCache.quill_delta
            }
          })
        }

        var response = await Api.documents.update({
          id: this.document.document_id,
          model: _.omit(this.documentCache, ['content', 'quill_delta'])
        })

        this.document = (new DocumentModel(response.data)).toJSON()
      } catch (info) {
        this.$notify.error('Error occured while saving changes: ' + info.toString())
      }

      this.isDocumentSaving = false
    },

    // Automatically track and save changes
    autoSave: _.debounce(function () {
      this.save()
    }, DEBOUNCE_TIME, DEBOUNCE_OPTIONS)
  },

  mounted () {
    this.initEditor()
  }
}
</script>
<template src="./template.html"></template>
<style src="./style.css"></style>
