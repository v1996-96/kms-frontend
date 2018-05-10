<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState } = createNamespacedHelpers('Account')

export default {
  name: 'kms-auth-signup-page',
  props: {
    'invitetoken': String
  },
  data: () => ({
    isSigningUp: false,
    isCheckingToken: false,
    showError: false,

    name: '',
    surname: '',
    password: '',

    showSnackbar: false,
    snackbarTimeout: 2000,
    snackbarText: 'Error occured'
  }),

  computed: {
    ...mapState({
      'invitation': s => s.invitation
    }),
    ...mapGetters({
      'canSignUp': 'canSignUp'
    }),

    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('You must specify name')
      return errors
    },
    surnameErrors () {
      const errors = []
      if (!this.$v.surname.$dirty) return errors
      !this.$v.surname.required && errors.push('You must specify surname')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('You must specify password')
      !this.$v.password.minLength && errors.push('Password must be at least 5 characters')
      return errors
    }
  },

  validations: {
    name: { required },
    surname: { required },
    password: { required, minLength: minLength(5) }
  },

  methods: {
    ...mapActions({
      'checkInviteAction': 'checkInvite',
      'signupAction': 'signup'
    }),

    checkInviteToken () {
      this.isCheckingToken = true
      this.checkInviteAction(this.invitetoken).then(() => {
        this.isCheckingToken = false
      }).catch(info => {
        this.isCheckingToken = false
        var message = info && info.response && info.response.data.message
        this.snackbarText = message || 'Something went wrong'
        this.showSnackbar = true
        this.showError = true
      })
    },

    signup () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isSigningUp = true
      this.signupAction({
        name: this.name,
        surname: this.surname,
        password: this.password,
        invitetoken: this.invitetoken
      }).then(response => {
        this.isSigningUp = false
        this.$router.push({ name: 'Dashboard' })
      }).catch(info => {
        this.isSigningUp = false
        var message = info && info.response && info.response.data.message
        this.snackbarText = message || 'Something went wrong'
        this.showSnackbar = true
      })
    }
  },

  created () {
    this.checkInviteToken()
  }
}
</script>
<template src="./template.html"></template>
