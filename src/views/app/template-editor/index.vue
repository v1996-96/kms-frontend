<script>
import _ from 'lodash'
import Api from '@/api'
import moment from 'moment'
import { mapState } from 'vuex'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import ToolbarComponent from './toolbar'
import Quill from 'quill'
import TemplateModel from '@/models/template'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import TemplateTypeSearch from '@/components/active/template-type-search'

const EDITOR_MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}
const EMPTY_DOCUMENT = {
  title: '',
  description: '',
  content: '',
  quill_delta: {},
  template_type: null
}
const FIELDS_TO_TRACK = ['title', 'description', 'content', 'template_type']
const DEBOUNCE_TIME = 10000 // Save changes after 10 seconds of typing
const DEBOUNCE_OPTIONS = { maxWait: 120000 } // Ensure that saving is being performed every 2 minutes

export default {
  name: 'kms-app-template-editor-page',
  props: {
    'projectslug': String,
    'templateslug': String
  },
  mixins: [TextFiltersMixin, DateFiltersMixin],
  components: {
    'kms-quill-toolbar': ToolbarComponent,
    'kms-template-type-search': TemplateTypeSearch
  },
  data: () => ({
    EDITOR_MODE,
    editorInstance: null,
    selectionFormats: null,

    isTemplateLoading: false,
    isTemplateSaving: false,
    lastSaveTime: null,

    keysEventListener: null,

    template: null,
    templateCache: _.assign({}, EMPTY_DOCUMENT)
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
    templateChanged () {
      var compareWith = this.template || EMPTY_DOCUMENT
      return _.some(FIELDS_TO_TRACK, (field) => !_.isEqual(this.templateCache[field], compareWith[field]))
    },

    titleErrors () {
      const errors = []
      if (!this.$v.templateCache.title.$dirty) return errors
      !this.$v.templateCache.title.required && errors.push('You must specify title')
      !this.$v.templateCache.title.maxLength && errors.push('Title is too long')
      !this.$v.templateCache.title.minLength && errors.push('Title must be at least 3 characters')
      return errors
    },
    descriptionErrors () {
      const errors = []
      if (!this.$v.templateCache.description.$dirty) return errors
      !this.$v.templateCache.description.maxLength && errors.push('Description is too long')
      return errors
    }
  },

  validations: {
    templateCache: {
      title: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(255)
      },
      description: {
        maxLength: maxLength(255)
      },
      template_type: {
        required
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
        this.resetTemplate()
      }
    },
    templateCache: {
      deep: true,
      handler: function () {
        if (this.templateChanged) {
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
        this.templateCache.quill_delta = this.editorInstance.getContents()
        this.templateCache.content = this.editorInstance.root.innerHTML
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

    resetTemplate () {
      this.template = null
      this.templateCache = _.assign({}, EMPTY_DOCUMENT)
    },
    fetch () {
      this.isTemplateLoading = true
      Api.templates.getSingle({ id: this.templateslug, quill: true }).then((response) => {
        this.isTemplateLoading = false
        this.template = (new TemplateModel(response.data)).toJSON()
        this.templateCache = _.assign({}, this.templateCache, this.template)

        try {
          this.editorInstance.setContents(JSON.parse(this.template.quill_delta))
        } catch (error) {
          throw new Error('Error parsing server response')
        }
      }).catch(info => {
        this.isTemplateLoading = false
        this.$notify.error('Error occured while loading template: ' + info.toString())
      })
    },

    async save () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      if (this.editorMode === EDITOR_MODE.CREATE) {
        await this.createTemplate()
      } else if (this.editorMode === EDITOR_MODE.EDIT) {
        await this.updateTemplate()
      }

      this.lastSaveTime = moment()
    },
    createTemplate () {
      this.isTemplateSaving = true

      var model = _.assign({}, this.templateCache)
      if (this.projectslug) {
        _.assign(model, {
          project_id: this.project.project_id
        })
      }
      if (_.has(model, 'quill_delta')) {
        model.quill_delta = JSON.stringify(model.quill_delta)
      }

      return Api.templates.create(model).then((response) => {
        this.isTemplateSaving = false
        this.template = (new TemplateModel(response.data)).toJSON()
        this.$router.replace({
          name: this.projectslug ? 'Project-template-edit' : 'Template-edit',
          params: _.assign({}, this.$route.params, { templateslug: this.template.slug })
        })
      }).catch(info => {
        this.isTemplateSaving = false
        this.$notify.error('Error creating template: ' + info.toString())
      })
    },
    async updateTemplate () {
      this.isTemplateSaving = true

      try {
        if (!_.isEqual(this.templateCache.content, this.template.content)) {
          await Api.templates.saveChanges({
            id: this.template.template_id,
            model: {
              content: this.templateCache.content,
              quill_delta: JSON.stringify(this.templateCache.quill_delta)
            }
          })
        }

        var response = await Api.templates.update({
          id: this.template.template_id,
          model: _.omit(this.templateCache, ['content', 'quill_delta'])
        })

        this.template = (new TemplateModel(response.data)).toJSON()
        if (this.templateslug !== this.template.slug) {
          this.$router.replace({
            name: this.projectslug ? 'Project-template-edit' : 'Template-edit',
            params: _.assign({}, this.$route.params, { templateslug: this.template.slug })
          })
        }
      } catch (info) {
        this.$notify.error('Error occured while saving changes: ' + info.toString())
      }

      this.isTemplateSaving = false
    },

    // Automatically track and save changes
    autoSave: _.debounce(function () {
      if (this.templateChanged) {
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
