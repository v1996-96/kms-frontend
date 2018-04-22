<template src="./template.html"></template>
<script>
import { TABLE_HEADERS, TABLE_FAKE_ENTRIES } from './config'

export default {
  name: 'kms-app-settings-page',
  data: () => ({
    headers: TABLE_HEADERS,
    items: TABLE_FAKE_ENTRIES
  })
}
</script>
