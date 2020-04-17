<template>
  <v-data-table
    :headers="headers"
    :items="customer"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Customer</v-toolbar-title>
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
              <v-btn  fab dark color="red" v-on="on" to="/menu/deleted-customer">
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
                    <v-text-field v-model="editedItem.nama" label="Nama Customer"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.alamat" label="Alamat"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.noTelp" label="No.Telepon"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                     Member :
                    <v-select 
                      v-model="editedItem.member"
                      flat
                      solo-inverted
                      hide-details
                      :items="memb"
                      label="Member"
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
      {{customer.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    search: '',
    memb: [
        "Yes",
        "No"
    ],
    headers: [
      {
        text: 'No.',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'Nama Customer', value: 'nama', },
      { text: 'Alamat', value: 'alamat', sortable: false, filterable: false  },
      { text: 'Tanggal Lahir', value: 'tglLahir', sortable: false, filterable: false  },
      { text: 'No.Telepon', value: 'noTelp', filterable: false, sortable: false },
      { text: 'Member', value: 'member', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    customer: [],
    deleted: [],
    temp: [],
    tes: '',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      alamat: '',
      noTelp: '',
      tglLahir: new Date().toISOString().substr(0, 10),
      member: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      nama: '',
      alamat: '',
      noTelp: '',
      tglLahir: new Date().toISOString().substr(0, 10),
      member: '',
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
      axios.get("http://luxinoire.com/api/showCustomer").then(response => {
        this.customer = []
        this.temp = response.data
        this.index = response.data.length
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Deleted") {
                this.customer.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },

    editItem (item) {
      this.editedIndex = this.customer.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.customer.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Are you sure you want to delete this item?') && this.customer.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateCustomer/"+temp["id"], {
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
        Object.assign(this.customer[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateCustomer/"+this.editedItem["id"], {
          nama: this.editedItem["nama"],
          alamat: this.editedItem["alamat"],
          noTelp: this.editedItem["noTelp"],
          tglLahir: this.editedItem["tglLahir"],
          member: this.editedItem["member"],
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
          .post("http://luxinoire.com/api/createCustomer", {
                nama: this.editedItem["nama"],
                alamat: this.editedItem["alamat"],
                noTelp: this.editedItem["noTelp"],
                tglLahir: this.editedItem["tglLahir"],
                member: this.editedItem["member"],
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