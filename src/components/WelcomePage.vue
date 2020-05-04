<template>
  <v-container>
    <v-card-text style="color:#f2a365;" class="text-center display-3 font-weight-black">Selamat Datang, {{this.$cookies.get(this.$user).nama}}</v-card-text>
    <v-card-text style="color:#f2a365;" class="text-center display-3 font-weight-black">Role anda adalah  : {{this.$cookies.get(this.$user).role}}</v-card-text>
    <v-card-text style="color:#f2a365;" class="text-center display-3 font-weight-black">Selamat Bekerja</v-card-text>
  </v-container>
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