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
      {{supplier.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'ID Transaksi', value: 'id_transaksi', },
      { text: 'Nama Produk', value: 'namaProduk', },
      { text: 'Jumlah', value: 'jumlah', filterable: false, sortable: false },
      { text: 'Satuan', value: 'satuan', filterable: false },
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
      axios.get("http://luxinoire.com/api/deletedTransaksiPemesanan").then(response => {
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

    deleteItem(item) {
        const index = this.transpem.indexOf(item)
        confirm('Hapus Permanen Item?') && this.transpem.splice(index, 1) &&
        axios.delete("http://luxinoire.com/api/deleteTransaksiPemesanan/"+ item.id)
        &&
        this.reloadData()
    },

    restore(item) {
      const index = this.transpem.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Kembalikan Item?') && this.transpem.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTransaksiPemesanan/"+temp["id"], {
          logAksi: 'Dikembalikan',
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })
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