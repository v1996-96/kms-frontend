<script>
import { mapState } from 'vuex'
import ToolbarComponent from './toolbar'
import Quill from 'quill'

export default {
  name: 'kms-app-project-editor-page',
  components: {
    'kms-quill-toolbar': ToolbarComponent
  },
  data: () => ({
    editorInstance: null,

    selectionFormats: null
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    }),
    containerClass () {
      return this.darkTheme ? ['grey', 'darken-4'] : ['grey', 'lighten-4']
    }
  },

  methods: {
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
    }
  },

  mounted () {
    this.editorInstance = new Quill(this.$refs.editor, {
      placeholder: 'Compose an epic...'
    })

    this.editorInstance.on('editor-change', (event, ...args) => {
      if (event === 'selection-change' && args[0]) {
        this.selectionFormats = this.editorInstance.getFormat(args[0])
      }
    })
  }
}
</script>
<template src="./template.html"></template>
<style src="./style.css" scoped></style>
