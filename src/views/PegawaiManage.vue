<template>
  <v-data-table
    :headers="headers"
    :items="pegawai"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    style="color: #30475e;"
    hide-default-footer
  >

    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title style="color: #30475e;">Pegawai</v-toolbar-title>
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


        <v-dialog v-model="dialog" max-width="1000" >
          <template v-slot:activator="{ on }">
             <v-btn  dark color="#f2a365" v-on="on" to="/menu/deleted-pegawai">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-3" dark color="#f2a365" v-on="on">
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
                    <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.alamat" label="Alamat"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.noTelp" label="No.Telepon"></v-text-field>
                  </v-col>
                   <v-col cols="12" sm="6" md="4">
                     Role :
                    <v-select 
                      v-model="editedItem.role"
                      flat
                      solo-inverted
                      hide-details
                      :items="roles"
                      label="Role"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.password" type="password" label="Password"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="confirm" type="password" label="Confirm Password"></v-text-field>
                  </v-col>
                  <v-col>
                    Tanggal Lahir :
                    <v-date-picker v-model="editedItem.tglLahir" full-width :landscape="$vuetify.breakpoint.smAndUp" color="green lighten-1"></v-date-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


         <v-dialog v-model="dialogEdit" max-width="1000" >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" >
                    <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.alamat" label="Alamat"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.noTelp" label="No. Telepon"></v-text-field>
                  </v-col>
                   <v-col cols="12" sm="6" md="4">
                     Role :
                    <v-select 
                      v-model="editedItem.role"
                      flat
                      solo-inverted
                      hide-details
                      :items="roles"
                      label="Role"
                    ></v-select>
                  </v-col>
                  <v-col >
                    Tanggal Lahir :
                    <v-date-picker v-model="editedItem.tglLahir" full-width :landscape="$vuetify.breakpoint.smAndUp" color="green lighten-1"></v-date-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
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
      {{pegawai.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
    dialogEdit: false,
    confirm: '',
    picker: new Date().toISOString().substr(0, 10),
    search: '',
    headers: [
      {
        text: 'No.',
        align: 'start',
        value: 'id',
        filterable: false 
      },
      { text: 'Nama', value: 'nama', },
      { text: 'Alamat', value: 'alamat', filterable: false, sortable: false},
      { text: 'Tanggal Lahir', value: 'tglLahir', filterable: false, sortable: false},
      { text: 'No. Telepon', value: 'noTelp', sortable: false, filterable: false},
      { text: 'Role', value: 'role'},
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    pegawai: [],
    tes: '',
    roles: [
      'CS',
      'Kasir',
      'Admin'
    ],
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      nama: '',
      alamat: '',
      tglLahir: new Date().toISOString().substr(0, 10),
      noTelp: '',
      role: '',
      password: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      nama: '',
      alamat: '',
      tglLahir: new Date().toISOString().substr(0, 10),
      noTelp: '',
      role: '',
      password: '',
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
      axios.get("http://luxinoire.com/api/showPegawai").then(response => {
        this.pegawai = response.data;
        this.index = response.data.length
        console.log(this.pegawai)
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },

    editItem (item) {
      this.editedIndex = this.pegawai.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },

    deleteItem (item) {
      const index = this.pegawai.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Hapus Item?') && this.pegawai.splice(index, 1) &&
       axios
        .put("http://luxinoire.com/api/updatePegawai/"+temp["id"], {
          nama: "Banned"+new Date().toLocaleString(),
          role: "Banned"+new Date().toLocaleString(),
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
      this.dialogEdit = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
        if (this.editedIndex > -1) {
          Object.assign(this.pegawai[this.editedIndex], this.editedItem)
          axios
          .put("http://luxinoire.com/api/updatePegawai/"+this.editedItem["id"], {
            nama: this.editedItem["nama"],
            alamat: this.editedItem["alamat"],
            tglLahir: this.editedItem["tglLahir"],
            noTelp: this.editedItem["noTelp"],
            role: this.editedItem["role"],
            logAksi: "Diubah",
            logAktor: this.$cookies.get(this.$user).nama,
            logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });
          this.reloadData()
          this.close()
      } else {
          if(this.editedItem["password"]!=this.confirm) {
            alert("Password Tidak Sama")
          }
          else {
            if(this.editedItem["nama"] == '' || this.editedItem["alamat"] == '' || this.editedItem["noTelp"] == '' || this.editedItem["role"] == '' || this.editedItem["password"] == '' ) {
              alert("Data Tidak Boleh Kosong !")
            }
            else {
              this.pegawai.push(this.editedItem)
              axios
              .post("http://luxinoire.com/api/register", {
                nama: this.editedItem["nama"],
                alamat: this.editedItem["alamat"],
                tglLahir: this.editedItem["tglLahir"],
                noTelp: this.editedItem["noTelp"],
                role: this.editedItem["role"],
                password: this.editedItem["password"],
                logAksi: "Ditambahkan",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
              })
              .then(response => {
                console.log(response.data)
              });
              this.reloadData()
              this.close()
            }
        }
      }
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