<template>
  <v-data-table
    :headers="headers"
    :items="tpl"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Transaksi Layanan</v-toolbar-title>
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
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn  fab dark color="red" v-on="on" to="/menu/deleted-tpl">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-1" fab dark color="indigo" @click="buat=true">
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
                  <v-col cols="12">
                     Nama Layanan :
                    <v-select
                      v-model="selectedL"
                      :items="layanan"
                      item-text="nama"
                      label="Nama Layanan"
                      return-object
                      flat
                      solo-inverted
                      @change="layananChange"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                     Nama Hewan :
                    <v-select
                      v-model="selectedH"
                      :items="hewan"
                      item-text="nama"
                      label="Nama Hewan"
                      return-object
                      flat
                      solo-inverted
                      @change="hewanChange"
                    ></v-select>
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


        <v-dialog v-model="buat" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Add Transaction</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                   <v-col cols="12">
                     ID Transaksi :
                    <v-select
                      v-model="kode"
                      :items="idTrans"
                      label="ID Transaksi"
                      return-object
                      flat
                      solo-inverted
                      @change="getData"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                     Nama Layanan :
                    <v-select
                      v-model="selectedL"
                      :items="layanan"
                      item-text="nama"
                      label="Nama Layanan"
                      return-object
                      flat
                      solo-inverted
                      @change="layananChange"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                     Nama Hewan :
                    <v-select
                      v-model="selectedH"
                      :items="hewan"
                      item-text="nama"
                      label="Nama Hewan"
                      return-object
                      flat
                      solo-inverted
                      @change="hewanChange"
                    ></v-select>
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
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{tpl.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    buat: false,
    search: '',
    ngedit: false,
    headers: [
      {
        text: 'No.',
        align: 'start',
        value: 'id',
        filterable: false 
      },
      { text: 'ID Transaksi', value: 'id_transaksi', },
      { text: 'Nama Layanan', value: 'nama_layanan', sortable: false },
      { text: 'Nama Hewan', value: 'nama_hewan', },
      { text: 'Jenis', value: 'jenisHewan', },
      { text: 'Ukuran', value: 'ukuranHewan', },
      { text: 'Harga', value: 'harga', sortable: false, filterable: false  },
      { text: 'Subtotal', value: 'subtotal', sortable: false, filterable: false  },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    tpl: [],
    deleted: [],
    temp: [],
    kode: '',
    idTrans: [],
    total: 0,
    layanan:[],
    customer: [],
    hewan: [],
    namaCust:'',
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      id_transaksi: '',
      nama_layanan: '',
      nama_hewan: '',
      ukuranHewan: '',
      jenisHewan: '',
      harga: '',
      subtotal: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      id_transaksi: '',
      nama_layanan: '',
      nama_hewan: '',
      ukuranHewan: '',
      jenisHewan: '',
      harga: '',
      subtotal: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    selectedL: [],
    selectedH: []
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
      this.kode = ''
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/showTPL").then(response => {
        this.tpl = []
        this.temp = response.data
        this.index = response.data.length
        this.total = 0
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Dihapus") {
                this.tpl.push(this.temp[i])
                this.idTrans.push(this.temp[i].id_transaksi)
            }
        }
      });
      this.reloadLayanan()

      axios.get("http://luxinoire.com/api/showCustomer").then(response => {
          this.temp = response.data
          for(var i in response.data) {
              this.customer.push(this.temp[i].nama)
          }
      });

      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
      
    },

    getData() {
        console.log(this.kode)
        axios.get("http://luxinoire.com/api/searchTransaksiPembayaran/"+this.kode).then(response => {
           this.namaCust = response.data.nama_customer
           console.log(this.namaCust)
           this.reloadHewan(this.namaCust) 
        });
    },

    buka() {
      confirm('Buat Transaksi?')&&
      this.createTrans()&&
      this.reloadData()
    },

    reloadLayanan() {
      axios.get("http://luxinoire.com/api/showLayanan").then(response => {
          this.layanan = response.data
      });
    },

    reloadHewan(nama) {
      this.hewan = []
      axios.get("http://luxinoire.com/api/showHewan").then(response => {
        this.temp = response.data
        for(var i in response.data) {
          if(this.temp[i].logAksi != "Dihapus" && this.temp[i].customer == nama) {
              this.hewan.push(this.temp[i])
          }
        }
      });
    },

    layananChange() {
      this.editedItem["nama_layanan"] = this.selectedL.nama
      this.editedItem["harga"] = this.selectedL.harga
      console.log(this.selectedL)
    },

    hewanChange() {
      this.editedItem["nama_hewan"] = this.selectedH.nama
      this.editedItem["ukuranHewan"] = this.selectedH.ukuranHewan
      this.editedItem["jenisHewan"] = this.selectedH.jenisHewan
      this.namaCust = this.selectedH.customer
      console.log(this.selectedH)
    },

    editItem (item) {
      this.editedIndex = this.tpl.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.kode = item.id_transaksi
      this.getData()
      this.selectedH.nama = this.editedItem["nama_hewan"]
      this.selectedL.nama = this.editedItem["nama_layanan"]
      this.dialog= true
    },

    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    customerChange() {
      if(this.namaCust != '') {
        this.buat = false
        this.ada = true
        this.reloadHewan()
      }
      else {
        alert("Customer tidak boleh kosong")
      }
    },

    deleteItem (item) {
      const index = this.tpl.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Hapus Item?') && this.tpl.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTPL/"+temp["id"], {
          logAksi: "Dihapus" ,
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })&&
        this.hitungTotal(item.id_transaksi)
        &&
        this.restock(item)
        this.reloadData()
    },

    close () {
      this.dialog = false
      this.buat = false
      console.log(this.namaCust)
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    hitungTotal(kode) {
      var self = this
      var id = kode
      this.total = 0
      setTimeout(function() {
        axios.get("http://luxinoire.com/api/searchTPL/"+id).then(response => {
          self.temp = response.data
          for(var i in response.data) {
              if(self.temp[i].logAksi != "Dihapus") {
                  self.total = self.total + self.temp[i].subtotal
              }
          }
        });
      }, 1500);
      setTimeout(function() {
        axios.put("http://luxinoire.com/api/updateTransaksiPembayaran/"+id, {
          total_harga: self.total
        })
        .then(response => {
          console.log(response.data)
        });
      }, 2500);
    },

    save () {
        if (this.editedIndex > -1) { 
          Object.assign(this.tpl[this.editedIndex], this.editedItem)
          axios
          .put("http://luxinoire.com/api/updateTPL/"+this.editedItem["id"], {
                  nama_layanan: this.editedItem["nama_layanan"],
                  harga: this.editedItem["harga"],
                  subtotal: this.editedItem["harga"],
                  nama_hewan:  this.editedItem["nama_hewan"],
                  ukuranHewan: this.editedItem["ukuranHewan"],
                  jenisHewan:  this.editedItem["jenisHewan"],
                  logAksi: "Diubah",
                  logAktor: this.$cookies.get(this.$user).nama,
                  logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });

        } else {
            axios
            .post("http://luxinoire.com/api/createTPL", {
                  id_transaksi: this.kode,
                  nama_layanan: this.editedItem["nama_layanan"],
                  harga: this.editedItem["harga"],
                  subtotal: this.editedItem["harga"],
                  nama_hewan:  this.editedItem["nama_hewan"],
                  ukuranHewan: this.editedItem["ukuranHewan"],
                  jenisHewan:  this.editedItem["jenisHewan"],
                  logAksi: "Ditambahkan",
                  logAktor: this.$cookies.get(this.$user).nama,
                  logWaktu: new Date().toLocaleString()
            })
            .then(response => {
              console.log(response.data)
            });
          }
          this.hitungTotal(this.kode)
          this.reloadData()
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