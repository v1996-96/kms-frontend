<template src="./template.html"></template>
<script>
import { TABLE_HEADERS } from './config'

export default {
  name: 'kms-app-settings-page',
  data: () => ({
    headers: TABLE_HEADERS,
    items: []
  })
}
</script>
