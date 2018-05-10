<template>
  <div>
    <v-tabs v-model="tabs" color="transparent">
      <v-tab>Uploader</v-tab>
      <v-tab>Attachments</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <div ref="uploader" class="clearfix"></div>
      </v-tab-item>
      <v-tab-item>
        <kms-attachments :documentId="documentId"></kms-attachments>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import Api from '@/api'
import Uppy from 'uppy/lib/core'
import Dashboard from 'uppy/lib/plugins/Dashboard'
import XHRUpload from 'uppy/lib/plugins/XHRUpload'
import AttachmentsTab from './attachments-tab'

export default {
  name: 'kms-document-attachments',
  props: {
    'documentId': [Number, String]
  },
  components: {
    'kms-attachments': AttachmentsTab
  },
  data: () => ({
    tabs: null,
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
