<template>
  <v-data-table
    :headers="headers"
    :items="transpem"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Transaksi Pembayaran</v-toolbar-title>
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
        <v-btn  fab dark color="red" to="/menu/deleted-transaksi-pembayaran">
            <v-icon dark>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="loading" fullscreen>
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

    <v-dialog v-model="Det" max-width="500px">
         <v-data-table
          :headers="headers2"
          :items="listItem"
          dense
          disable-pagination
          hide-default-footer
        />
        <v-card-actions class="white">
          <v-spacer/>
          <v-btn color="blue darken-1" text @click="Det=false">Close</v-btn>
          <v-spacer/>
        </v-card-actions>
    </v-dialog>

    <v-dialog v-model="diskon" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Create Transaction</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field type="number" min="1" max="50" v-model="disc" label="Diskon"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="diskon=false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="lunas">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="addDisc(item)"
      >
        mdi-check-circle
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
      {{transpem.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:item.details="{item}">
      <v-btn color="primary" @click="detailItem(item.id_transaksi)">Detail</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    Det: false,
    disc: 0,
    diskon: false,
    headers: [
      {
        text: 'No.',
        align: 'start',
        value: 'id',
        filterable: false 
      },
      { text: 'ID Transaksi', value: 'id_transaksi', },
      { text: 'Nama Customer', value: 'nama_customer', sortable: false },
      { text: 'Telp. Customer', value: 'telp_customer', },
      { text: 'Total Harga', value: 'total_harga', },
      { text: 'Tanggal Transaksi', value: 'tanggal', },
      { text: 'Status', value: 'status', sortable: false, filterable: false  },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Detail', value: 'details', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    headers2: [
      { text: 'Nama Item / Layanan', value: 'nama', filterable: false, sortable: false  },
      { text: 'Jumlah', value: 'jumlah', filterable: false, sortable: false },
      { text: 'Subtotal', value: 'subtotal', filterable: false, sortable: false  },
    ],
    transpem: [],
    itemDetail: {
      id: '',
      nama: '',
      jumlah: '',
      subtotal: '',
    },
    defDetail: {
      id: '',
      nama: '',
      jumlah: '',
      subtotal: '',
    },
    deleted: [],
    temp: [],
    listItem: [],
    search: '',
    ada: false,
    penampung: 0,
    kode: '',
    total: 0,
    layanan:[],
    loading: false,
    customer: [],
    hewan: [],
    custData: [],
    data2: [],
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      id_transaksi: '',
      nama_customer: '',
      telp_customer: '',
      total_harga: '',
      tanggal: '',
      status: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      id_transaksi: '',
      nama_customer: '',
      telp_customer: '',
      total_harga: '',
      tanggal: '',
      status: '',
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
      this.transpem = []
      this.diskon = 0
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/showTransaksiPembayaran").then(response => {
        this.tpl = []
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Dihapus" && this.temp[i].status != "Lunas") {
                this.transpem.push(this.temp[i])
            }
        }
      })
      console.log(self.$cookies.get(this.$user).nama)
      this.$adminDrawer.value = true
    },
    
    restock(item) {
      var id = item.id_produk
      console.log("ini id produk =" +id)
      axios.get("http://luxinoire.com/api/searchProduk/"+id).then(response => {
          this.penampung = 0
          this.penampung = response.data.stok + item.jumlah
          axios.put("http://luxinoire.com/api/updateProduk/"+id, {
            stok: this.penampung
          })
      });
      axios.put("http://luxinoire.com/api/updateTPP/"+item.id, {
            logAksi: 'Dihapus',
            logAktor: this.$cookies.get(this.$user).nama,
            logWaktu: new Date().toLocaleString()
      })
    },

    detailItem(kode) {
        this.Det = true
        this.listItem = []
        if("PR" < kode == true) {
           axios.get("http://luxinoire.com/api/searchTPP/"+kode).then(response => {
              this.listItem = []
              this.temp = response.data
              for(var i in response.data) {
                 this.itemDetail["id"] = this.temp[i].id
                 this.itemDetail["nama"] = this.temp[i].nama_produk
                 this.itemDetail["jumlah"] = this.temp[i].jumlah
                 this.itemDetail["subtotal"] = this.temp[i].subtotal
                 this.listItem.push(this.itemDetail)
                 this.itemDetail = Object.assign({}, this.defDetail)
              }
              console.log(response.data)
           });
        }
        else {
          axios.get("http://luxinoire.com/api/searchTPL/"+kode).then(response => {
              this.listItem = []
              this.temp = response.data
              for(var i in response.data) {
                 this.itemDetail["id"] = this.temp[i].id
                 this.itemDetail["nama"] = this.temp[i].nama_layanan
                 this.itemDetail["jumlah"] = 1
                 this.itemDetail["subtotal"] = this.temp[i].subtotal
                 this.listItem.push(this.itemDetail)
                 this.itemDetail = Object.assign({}, this.defDetail)
              }
           });
        }
    },
    
    DeleteTrans(kode) {
        this.loading = true
        console.log("PR" < kode)
        if("PR" < kode == true) {
           axios.get("http://luxinoire.com/api/searchTPP/"+kode).then(response => {
              this.temp = response.data
              for(var i in response.data) {
                if(this.temp[i].logAksi != "Dihapus") {
                    this.restock(this.temp[i])
                }
              }
              this.loading = false
           });
        }
        else {
          axios.get("http://luxinoire.com/api/searchTPL/"+kode).then(response => {
              this.temp = response.data
              for(var i in response.data) {
                if(this.temp[i].logAksi != "Dihapus") {
                    axios.put("http://luxinoire.com/api/updateTPL/"+this.temp[i].id, {
                          logAksi: 'Dihapus',
                          logAktor: this.$cookies.get(this.$user).nama,
                          logWaktu: new Date().toLocaleString()
                    })
                }
              }
              this.loading = false
           });
        }
    },

    deleteItem (item) {
      const index = this.transpem.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Hapus Item?') && this.transpem.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTransaksiPembayaran/"+temp["id_transaksi"], {
          logAksi: 'Dihapus',
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })
        &&
        this.DeleteTrans(item.id_transaksi)
        &&
        this.reloadData()
    },

    addDisc(item) {
      this.data2 = []
      this.diskon = true
      this.data2 = item
      console.log(item.total_harga)
    },

    lunas() {
        const index = this.transpem.indexOf(this.data2)
        confirm('Lunaskan Transaksi?') && this.transpem.splice(index, 1) &&
        axios
        .put("http://luxinoire.com/api/updateTransaksiPembayaran/"+this.data2.id_transaksi, {
            total_harga: this.data2.total_harga - this.disc,
            diskon: this.disc,
            status: "Lunas",
            logAksi: 'Diubah',
            logAktor: this.$cookies.get(this.$user).nama,
            logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })
        &&
        this.reloadData()

        this.diskon = false
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