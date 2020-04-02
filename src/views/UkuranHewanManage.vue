<template>
  <v-data-table
    :headers="headers"
    :items="ukuran"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Ukuran Hewan</v-toolbar-title>
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
              <v-btn  fab dark color="red" v-on="on" to="/menu/deleted-ukuran">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-3" fab dark color="indigo" v-on="on">
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
                    <v-text-field v-model="editedItem.nama" label="Ukuran Hewan"></v-text-field>
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
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} by {{item.logAktor}} on {{item.logWaktu}}
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
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'Ukuran Hewan', value: 'nama', },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    ukuran: [],
    deleted: [],
    temp: [],
    tes: '',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      nama: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
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
    initialize () {
      axios.get("http://luxinoire.com/api/showUkuranHewan").then(response => {
        this.temp = response.data
        this.index = response.data.length
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Deleted") {
                this.ukuran.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },

    editItem (item) {
      this.editedIndex = this.ukuran.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.ukuran.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Are you sure you want to delete this item?') && this.ukuran.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateUkuranHewan/"+temp["id"], {
          logAksi: "Deleted" ,
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
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
        Object.assign(this.ukuran[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateUkuranHewan/"+this.editedItem["id"], {
          nama: this.editedItem["nama"],
          logAksi: "Edited",
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        });
      } else {
          axios
          .post("http://luxinoire.com/api/createUkuranHewan", {
                nama: this.editedItem["nama"],
                logAksi: "Added",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });
          this.ukuran.push(this.editedItem)
        }
      this.close()
    },
  },
}
</script>