<template>
  <v-data-table
    :headers="headers"
    :items="supplier"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    style="color: #30475e;"
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title style="color: #30475e;">Supplier</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-icon>mdi-magnify</v-icon>
        <v-text-field
          class="pr-12"
          v-model="search"
          label="Cari"
          color="#30475e"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
             <v-btn  dark color="#f2a365" v-on="on" to="/menu/deleted-supplier">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-3"  dark color="#f2a365" v-on="on">
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
                    <v-text-field v-model="editedItem.nama" label="Nama Supplier"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.alamat" label="Alamat"></v-text-field>
                  </v-col>
                  <v-col cols="12" >
                    <v-text-field v-model="editedItem.noTelp" label="No.Telepon"></v-text-field>
                  </v-col>
                  <v-col cols="12" >
                    <v-text-field v-model="editedItem.kota" label="Kota"></v-text-field>
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
        color="green"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        color="red"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.id="{item}">
      {{supplier.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
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
        text: 'No.',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'Nama Supplier', value: 'nama', },
      { text: 'Alamat', value: 'alamat', sortable: false, filterable: false  },
      { text: 'No.Telepon', value: 'noTelp', sortable: false, filterable: false  },
      { text: 'Kota', value: 'kota', filterable: false },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    supplier: [],
    tes: '',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      alamat: '',
      noTelp: '',
      kota: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      nama: '',
      alamat: '',
      noTelp: '',
      kota: '',
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
      axios.get("http://luxinoire.com/api/showSupplier").then(response => {
        this.supplier = response.data;
        this.index = response.data.length
        console.log(this.supplier)
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },

    editItem (item) {
      this.editedIndex = this.supplier.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.supplier.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Hapus Item?') && this.supplier.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateSupplier/"+temp["id"], {
          logAksi: "Dihapus",
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
        Object.assign(this.supplier[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateSupplier/"+this.editedItem["id"], {
          nama: this.editedItem["nama"],
          alamat: this.editedItem["alamat"],
          noTelp: this.editedItem["noTelp"],
          kota: this.editedItem["kota"],
          logAksi: "Edited",
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        });
        this.reloadData()
      } 
      else {
        axios.post("http://luxinoire.com/api/createSupplier", {
                nama: this.editedItem["nama"],
                alamat: this.editedItem["alamat"],
                noTelp: this.editedItem["noTelp"],
                kota: this.editedItem["kota"],
                logAksi: "Added",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)  
          })
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