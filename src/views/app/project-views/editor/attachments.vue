<template>
  <div>
    <div ref="uploader" class="clearfix"></div>
  </div>
</template>
<script>
import Api from '@/api'
import Uppy from 'uppy/lib/core'
import Dashboard from 'uppy/lib/plugins/Dashboard'
import XHRUpload from 'uppy/lib/plugins/XHRUpload'

export default {
  name: 'kms-document-attachments',
  props: {
    'documentId': [Number, String]
  },
  data: () => ({
    uploaderInstance: null
  }),

  methods: {
    initUppy () {
      this.uploaderInstance = Uppy({ autoProceed: false })
        .use(Dashboard, {
          target: this.$refs.uploader,
          inline: true,
          height: 400,
          replaceTargetContent: true,
          showProgressDetails: true,
          metaFields: [
            { id: 'name', name: 'Name', placeholder: 'File name' }
          ]
        })
        .use(XHRUpload, {
          fieldName: 'file',
          endpoint: Api.documents.attachmentsEndpoint({ id: this.documentId }),
          headers: Api.documents.attachmentsHeaders()
        }).run()
    }
  },

  mounted () {
    this.initUppy()
  }
}
</script>
<style scoped>
.clearfix {
  overflow: hidden;
}
</style>
