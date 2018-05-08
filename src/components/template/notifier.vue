<template>
  <v-snackbar :value="isActive" :timeout="timeout" :color="type" :multi-line="multiline" bottom>
    {{ text }}
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'kms-template-notifier',
  computed: {
    ...mapState({
      'type': s => s.Notifier.type,
      'text': s => s.Notifier.text,
      'multiline': s => s.Notifier.multiline,
      'timeout': s => s.Notifier.timeout,
      'isActive': s => s.Notifier.isActive
    })
  }
}
</script>
