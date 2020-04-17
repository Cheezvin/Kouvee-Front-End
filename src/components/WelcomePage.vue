<template>
  <v-card-text class="text-center display-3 font-weight-black">Welcome to Menu Page, {{this.$cookies.get(this.$user).nama}}</v-card-text>
</template>

<script>

export default {
  created () {
    console.log(this.$cookies.get(this.$isLogin.value))
    if(this.$cookies.get(this.$isLogin.value) == 'Login') {
      this.initialize()
    }
    else {
      this.$router.push("/menu/login")
    }
  },

  methods: {
    initialize () {
      this.$user.role = this.$cookies.get(this.$user).role
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
  }
}
</script>