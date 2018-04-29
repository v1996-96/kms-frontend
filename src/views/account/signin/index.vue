<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('Account')

export default {
  name: 'kms-auth-login-page',
  data: () => ({
    isSigningIn: false,
    showSnackbar: false,
    snackbarTimeout: 2000,
    snackbarText: 'Error occured',

    email: '',
    password: ''
  }),

  methods: {
    ...mapActions({
      'signinAction': 'signin'
    }),

    signin () {
      this.isSigningIn = true
      this.signinAction({
        email: this.email,
        password: this.password
      }).then(() => {
        this.isSigningIn = false
        this.$router.push({ name: 'Dashboard' })
      }).catch((info) => {
        this.isSigningIn = false
        var message = info && info.response && info.response.data.message
        this.snackbarText = message || 'Something went wrong'
        this.showSnackbar = true
      })
    }
  }
}
</script>
<template src="./template.html"></template>
