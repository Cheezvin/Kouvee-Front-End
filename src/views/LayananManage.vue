<template>
  <v-data-table
    :headers="headers"
    :items="services"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Layanan</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-icon>mdi-magnify</v-icon>
        <v-text-field
          class="pr-12"
          v-model="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
             <v-btn class="mr-12" fab dark color="indigo" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" >
                    <v-text-field v-model="editedItem.nama" label="Nama Layanan"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.harga" label="Harga"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    Gambar : 
                    <input v-mode="editedItem.gambar" type="file" @change="onFileSelected">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="loading" fullscreen full-width>
        <v-container fluid fill-height style="background-color: rgba(0, 0, 0, 0.8);">
         <v-layout justify-center align-center>
            <v-progress-circular
              :size="100"
              :width="10"
              color="primary"
              indeterminate>
              Uploading
            </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.gambar="{item}">
      <v-img class="text-center ml-12" height="150" width="130" :src="item.gambar"></v-img>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    search: '',
    loading: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: '', value: 'gambar', sortable: false, filterable: false },
      { text: 'Nama Layanan', value: 'nama', },
      { text: 'Harga', value: 'harga', filterable: false  },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
    ],
    services: [],
    tes: '',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      harga: 0,
      gambar: ''
    },
    defaultItem: {
      nama: '',
      harga: 0,
      gambar: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

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
    onFileSelected (event) {
      this.selectedFile =  event.target.files[0]
      console.log(this.selectedFile)
    },

    uploadImg () {
      var storageRef = this.fb.storage().ref("layanan/"+this.selectedFile.name)
      let uploading = storageRef.put(this.selectedFile)
      console.log(uploading)
    },

    initialize () {
      axios.get("http://luxinoire.com/api/showLayanan").then(response => {
        this.services = response.data;
        this.index = response.data.length
        console.log(this.services)
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },

    editItem (item) {
      this.editedIndex = this.services.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.services.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Are you sure you want to delete this item?') && this.services.splice(index, 1) &&
      axios.delete("http://luxinoire.com/api/deleteLayanan/"+ temp["id"])
      .then(response => {
        console.log(response)
      });
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateLayanan/"+this.editedItem["id"], {
          nama: this.editedItem["nama"],
          harga: this.editedItem["harga"],
        })
        .then(response => {
          console.log(response.data)
        });
        if(this.selectedFile != null) {
          this.uploadImg()
          var temp = this.editedItem["id"]
          var self = this
          setTimeout(function() {
            self.tes = self.fb.storage().ref("layanan").child(self.selectedFile.name).
            getDownloadURL().then(function(url){
                var id = temp
                console.log(id)
                axios.put("http://luxinoire.com/api/updateLayanan/"+id, {
                        gambar: url,
                }).then(response => {
                  console.log(self.tes + response)
                  self.services = self.initialize()
                })
            })
          }, 10000);
        }
      } else {
        this.loading = true
        this.services.push(this.editedItem)
          axios
          .post("http://luxinoire.com/api/createLayanan", {
            nama: this.editedItem["nama"],
            harga: this.editedItem["harga"],
            gambar: "default"
          })
          .then(response => {
            console.log(response.data)
            temp = response.data["id"]
          });
          console.log(temp)
          self = this
          if(this.selectedFile != null) {
            this.uploadImg()
            setTimeout(function() {
            self.tes = self.fb.storage().ref("layanan").child(self.selectedFile.name).
            getDownloadURL().then(function(url){
                var id = temp
                console.log(id)
                axios.put("http://luxinoire.com/api/updateLayanan/"+id, {
                        gambar: url,
                }).then(response => {
                  console.log(self.tes + response)
                  self.services = self.initialize()
                })
            })
            self.loading = false
          }, 10000);
        }
      }
      this.close()
    },
  },
}
</script>