<template src="./template.html"></template>
<script>
import Quill from 'quill'

export default {
  name: 'kms-app-editor-page',
  data: () => ({
    editorInstance: null
  }),
  mounted () {
    this.editorInstance = new Quill(this.$refs.editor, {
      theme: 'snow'
    })
  }
}
</script>
