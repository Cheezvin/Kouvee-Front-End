<template>
    <v-data-table
    :headers="headers"
    :items="transpem"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    hide-default-footer
  >
  <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
    <v-icon>mdi-magnify</v-icon>
        <v-text-field
          class="pr-12"
          v-model="search"
          label="Cari"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
  </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{transpem.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="restore(item)"
      >
        mdi-reload
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
 
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({
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
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    transpem: [],
    deleted: [],
    temp: [],
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
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/deletedTransaksiPembayaran").then(response => {
        this.tpl = []
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi == "Dihapus" && this.temp[i].status != "Lunas") {
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
          this.penampung = response.data.stok
          axios.put("http://luxinoire.com/api/updateProduk/"+id, {
            stok: this.penampung - item.jumlah
          })
      });
      axios.put("http://luxinoire.com/api/updateTPP/"+item.id, {
            logAksi: 'Dikembalikan',
            logAktor: this.$cookies.get(this.$user).nama,
            logWaktu: new Date().toLocaleString()
      })
    },
    
    RestoreTrans(kode) {
        this.loading = true
        console.log("PR" < kode)
        if("PR" < kode == true) {
           axios.get("http://luxinoire.com/api/searchTPP/"+kode).then(response => {
              this.temp = response.data
              for(var i in response.data) {
                if(this.temp[i].logAksi == "Dihapus") {
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
                if(this.temp[i].logAksi == "Dihapus") {
                    axios.put("http://luxinoire.com/api/updateTPL/"+this.temp[i].id, {
                          logAksi: 'Dikembalikan',
                          logAktor: this.$cookies.get(this.$user).nama,
                          logWaktu: new Date().toLocaleString()
                    })
                }
              }
              this.loading = false
           });
        }
    },

    deleteItem(item) {
        const index = this.transpem.indexOf(item)
        confirm('Hapus Permanen Item?') && this.transpem.splice(index, 1) &&
        axios.delete("http://luxinoire.com/api/deleteTransaksiPembayaran/"+ item.id)&&
        this.DeleteTrans(item.id_transaksi)
        &&
        this.reloadData()
    },

    DeleteTrans(kode) {
        this.loading = true
        console.log("PR" < kode)
        if("PR" < kode == true) {
           axios.get("http://luxinoire.com/api/searchTPP/"+kode).then(response => {
              this.temp = response.data
              for(var i in response.data) {
                if(this.temp[i].logAksi == "Dihapus") {
                    axios.delete("http://luxinoire.com/api/deleteTPP/"+ this.temp[i].id)
                }
              }
              this.loading = false
           });
        }
        else {
          axios.get("http://luxinoire.com/api/searchTPL/"+kode).then(response => {
              this.temp = response.data
              for(var i in response.data) {
                if(this.temp[i].logAksi == "Dihapus") {
                    axios.delete("http://luxinoire.com/api/deleteTPL/"+ this.temp[i].id)
                }
              }
              this.loading = false
           });
        }
    },

    restore(item) {
      const index = this.transpem.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Kembalikan Item') && this.transpem.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTransaksiPembayaran/"+temp["id_transaksi"], {
          logAksi: 'Dikembalikan',
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })
        &&
        this.RestoreTrans(item.id_transaksi)
        &&
        this.reloadData()
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