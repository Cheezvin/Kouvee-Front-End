<template>
  <v-data-table
    :headers="headers"
    :items="hewan"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Hewan</v-toolbar-title>
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
              <v-btn  fab dark color="red" v-on="on" to="/menu/deleted-hewan">
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
                    <v-text-field v-model="editedItem.nama" label="Nama Hewan"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                     Jenis Hewan :
                    <v-select 
                      v-model="editedItem.jenisHewan"
                      flat
                      solo-inverted
                      hide-details
                      :items="jh"
                      label="Jenis Hewan"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                     Nama Customer :
                    <v-select 
                      v-model="editedItem.customer"
                      flat
                      solo-inverted
                      hide-details
                      :items="nc"
                      label="Nama Customer"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" >
                    Tanggal Lahir :
                    <v-date-picker v-model="editedItem.tglLahir" full-width :landscape="$vuetify.breakpoint.smAndUp" color="green lighten-1"></v-date-picker>
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
    <template v-slot:item.id="{item}">
      {{hewan.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    search: '',
    jh: [],
    nc: [],
    headers: [
      {
        text: 'No.',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'Nama Hewan', value: 'nama', },
      { text: 'Tanggal Lahir', value: 'tglLahir', sortable: false, filterable: false  },
      { text: 'Jenis Hewan', value: 'jenisHewan', filterable: false, sortable: false },
      { text: 'Pemilik', value: 'customer', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    hewan: [],
    deleted: [],
    temp: [],
    tes: '',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      jenisHewan: '',
      customer: '',
      tglLahir: new Date().toISOString().substr(0, 10),
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      nama: '',
      jenisHewan: '',
      customer: '',
      tglLahir: new Date().toISOString().substr(0, 10),
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
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/showHewan").then(response => {
        this.hewan = []
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Deleted") {
                this.hewan.push(this.temp[i])
            }
        }
      });
      axios.get("http://luxinoire.com/api/showJenisHewan").then(response => {
        for(var i in response.data) {
            this.jh.push(response.data[i].nama)
        }
      });
      axios.get("http://luxinoire.com/api/showCustomer").then(response => {
        for(var i in response.data) {
            this.nc.push(response.data[i].nama)
        }
      });
      this.$adminDrawer.value = true
    },

    editItem (item) {
      this.editedIndex = this.hewan.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.hewan.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Are you sure you want to delete this item?') && this.hewan.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateHewan/"+temp["id"], {
          logAksi: "Deleted" ,
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
        Object.assign(this.hewan[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateHewan/"+this.editedItem["id"], {
          nama: this.editedItem["nama"],
          jenisHewan: this.editedItem["jenisHewan"],
          customer: this.editedItem["customer"],
          tglLahir: this.editedItem["tglLahir"],
          logAksi: "Edited",
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        });
        this.reloadData()
      } else {
          axios
          .post("http://luxinoire.com/api/createHewan", {
                nama: this.editedItem["nama"],
                jenisHewan: this.editedItem["jenisHewan"],
                customer: this.editedItem["customer"],
                tglLahir: this.editedItem["tglLahir"],
                logAksi: "Added",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });
          this.reloadData()
        }
      this.close()
    },
    reloadData() {
      var self = this
      setTimeout(function() {
        self.initialize()
      }, 1000);
    }
  },
}
</script>