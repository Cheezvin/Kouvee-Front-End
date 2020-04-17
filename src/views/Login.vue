<template>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" >
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-spacer/>
                    <v-img alt="Vuetify Name" class="shrink hidden-sm-and-down" height="50" src="../assets/logokouvee.png" width="130"/>
                <v-spacer/>
              </v-toolbar>
              <v-card-text>
                <v-form>
                    <v-icon>mdi-mail</v-icon>
                    <v-text-field v-model="name" class="subtitle-2" label="Nama" name="login" type="text"/>  
                    <v-icon>mdi-lock</v-icon>
                    <v-text-field v-model="pass" class="subtitle-2" label="Password" name="password" type="password"/>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" class="mb-3 py-4 px-4" @click="login">Login</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>
import axios from 'axios';
  export default {
    data(){
      return {
        err: '',
        name: '',
        pass: ''
      }
    },
    created() {
      this.$cookies.set(this.$isLogin.value, 'logout')
      this.$adminDrawer.value = false;
      this.$customerBar.value = false;
      if(this.$cookies.get(this.$isLogin.value) == "Login") {
        this.$router.push("/menu")
      }
    },
    methods: {
      login() {
       
        if(this.name == '' || this.password == '') {
          alert("Nama atau Password tidak boleh kosong")
        }
        else {
          this.err = ''
          axios.post("http://luxinoire.com/api/login", {
              nama: this.name,
              password: this.pass,
          })
          .then((response) => {
            console.log(response.data)
            this.$cookies.set(this.$user, response.data, "1h")
          })
          .catch((error) => {
            console.log(error.response.data.error)
            this.err = error.response.data.error
          })
          var self = this
          setTimeout(function() {
            console.log(self.err)
            if(self.err == "Nama atau Password Salah") {
              alert("Nama atau Password Salah")
            }
            else {
              self.$cookies.set(self.$isLogin.value, 'Login', "1h")
              let current_datetime = new Date()
              if(self.$cookies.get(self.$date.value) != current_datetime.getDate()) {
                self.$cookies.set(self.$date.value, current_datetime.getDate(), "1d")
                self.$cookies.set(self.$incrementP.value, 1, "1d")
                self.$cookies.set(self.$incrementL.value, 1, "1d")
              }
              self.$router.push("/menu")
            }
          },2000)
        }
      }
    },
  }
</script>