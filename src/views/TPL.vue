<template>
  <v-data-table
    :headers="headers"
    :items="tpl"
    :search="search"
    style="color: #30475e;"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title style="color: #30475e;">Transaksi Layanan</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        Nama Customer : {{custData.nama}}
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-icon>mdi-magnify</v-icon>
        <v-text-field
          class="pr-12"
          color="#30475e"
          v-model="search"
          label="Cari"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn   dark color="#f2a365" v-on="on" to="/menu/deleted-tpl">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-1"  dark color="#f2a365" v-show="ada" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn class="mr-1"  dark color="#f2a365" v-on="on" to="/menu/tpl-list">
              <v-icon dark>mdi-format-list-bulleted</v-icon>
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
              <span class="headline">Buat Transaksi</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                   <v-col cols="12">
                     Nama Customer :
                    <v-select
                      v-model="custData"
                      :items="customer"
                      item-text="nama"
                      label="Nama Customer"
                      return-object
                      flat
                      solo-inverted
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="customerChange">Save</v-btn>
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
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{tpl.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:no-data>
      Transaksi Kosong, Mohon Tambahkan Customer Dahulu
      <v-spacer/>
      <v-btn color="#f2a365" dark v-show="!ada" @click="buat=true">Tambah Customer</v-btn>
    </template>
    <template v-slot:footer>
       <v-toolbar flat color="white" class="mt-8 mb-2 ml-12">
        <v-toolbar-title style="color: #30475e;">Total Harga</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-toolbar-title style="color: #30475e;">{{total}}</v-toolbar-title>
        <v-spacer/>
        <v-btn color="#f2a365" dark class="px-10 mr-12 py-5" @click="buka">Buat Transaksi</v-btn>
       </v-toolbar>
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
      { text: 'Status', value: 'status', filterable: false  },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    tpl: [],
    deleted: [],
    temp: [],
    ada: false,
    penampung: 0,
    kode: '',
    total: 0,
    layanan:[],
    customer: [],
    hewan: [],
    custData: [],
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
      this.ada = false
      let current_datetime = new Date()
      let formatted_date = this.appendLeadingZeroes(current_datetime.getDate()) + this.appendLeadingZeroes(current_datetime.getMonth() + 1).toLocaleString() + (current_datetime.getFullYear()-2000)
      this.kode = "LY-"+formatted_date+"-"+ this.appendLeadingZeroes(this.$cookies.get(this.$incrementL.value))
      console.log(this.kode)
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/searchTPL/"+this.kode).then(response => {
        this.tpl = []
        this.temp = response.data
        this.index = response.data.length
        this.total = 0
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Dihapus") {
                this.tpl.push(this.temp[i])
                this.total = this.total + this.temp[i].subtotal
            }
        }
      });

      axios.get("http://luxinoire.com/api/searchTransaksiPembayaran/"+this.kode).then(response => {
          console.log(response.data.nama_customer)
          if(response.data.nama_customer != null) {
            this.custData.nama = response.data.nama_customer
            this.reloadHewan(response.data.nama_customer)
            this.ada = true
          }
      });

      this.reloadLayanan()
      

      axios.get("http://luxinoire.com/api/showCustomer").then(response => {
          this.temp = response.data
          for(var i in response.data) {
              this.customer.push(this.temp[i])
          }
      });

      this.selectedL = []
      this.selectedH = []

      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
      
    },


    buka() {
      if(this.total == 0) {
        alert("No Transaction !")
      }
      else {
        confirm('Buat Transaksi?')&&
        this.createTrans()&&
        this.reloadData()
      }
    },

    createTrans() {
        console.log(this.custData)
        axios
          .put("http://luxinoire.com/api/updateTransaksiPembayaran/"+this.kode, {
                total_harga: this.total,
                logAksi: "Ditambahkan",
                logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });
          this.$cookies.set(this.$incrementL.value, parseInt(this.$cookies.get(this.$incrementL.value))+1)
          this.buat = false
          this.custData= []
          this.reloadData()
    },

    reloadLayanan() {
      axios.get("http://luxinoire.com/api/showLayanan").then(response => {
          this.layanan = response.data
      });
    },

    reloadHewan() {
      axios.get("http://luxinoire.com/api/showHewan").then(response => {
        this.temp = response.data
        for(var i in response.data) {
          if(this.temp[i].logAksi != "Dihapus" && this.temp[i].customer == this.custData.nama) {
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
      console.log(this.selectedH)
    },

    editItem (item) {
      this.editedIndex = this.tpl.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.selectedH.nama = this.editedItem["nama_hewan"]
      this.selectedL.nama = this.editedItem["nama_layanan"]
      this.dialog = true
    },

    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    customerChange() {
      console.log(this.custData)
      if(this.custData.nama != null) {
        axios
          .post("http://luxinoire.com/api/createTransaksiPembayaran", {
                id_transaksi: this.kode,
                nama_customer: this.custData.nama,
                telp_customer: this.custData.noTelp,
                total_harga: 0,
                diskon: 0,
                status: "Belum Lunas",
                tanggal: new Date().toLocaleString(),
                logAksi: "Dihapus",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: "default"
          })
          .then(response => {
            console.log(response.data)
          });
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
        })
        .then(response => {
          console.log(response.data)
        })&&
        this.reloadData()
    },

    close () {
      this.dialog = false
      this.buat = false
      this.ngedit = false
      console.log(this.custData)
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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
                  status: "Belum Selesai",
                  logAksi: "Ditambahkan",
                  logAktor: this.$cookies.get(this.$user).nama,
                  logWaktu: new Date().toLocaleString()
            })
            .then(response => {
              console.log(response.data)
            });
          }
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