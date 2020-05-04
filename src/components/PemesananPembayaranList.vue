<template>
  <v-data-table
    :headers="headers"
    :items="transpem"
    :search="search"
    style="color: #30475e;"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title style="color: #30475e;">Transaksi Pemesanan</v-toolbar-title>
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
          color= "#30475e"
          hide-details
        ></v-text-field>
        <v-btn dark color="#f2a365" to="/menu/deleted-pemesanan-pembayaran">
          <v-icon dark>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
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

    <v-dialog v-model="loading" fullscreen>
        <v-container fluid fill-height style="background-color: rgba(0, 0, 0, 0.8);">
         <v-layout justify-center align-center>
            <v-progress-circular
              :size="100"
              :width="10"
              color="#f2a365"
              indeterminate>
              Menyimpan
            </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        color="red"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
      <v-icon
        small
        color="green"
        @click="lunas(item)"
      >
        mdi-check-circle
      </v-icon>
    </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{transpem.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:item.detail="{item}">
      <v-btn color="#f2a365" dark @click="detailItem(item.id_transaksi)">Detail</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    search: '',
    kode: '',
    jual: 0,
    penam: 0,
    penTot: 0,
    loading: false,
    buat: false,
    headers: [
      {
        text: 'No.',
        align: 'start',
        sortable: false,
        value: 'id',
        filterable: false 
      },
      { text: 'ID Transaksi', value: 'id_transaksi', },
      { text: 'Nama Supplier', value: 'nama_supp', },
      { text: 'Telp. Supplier', value: 'telp_supp', filterable: false, sortable: false },
      { text: 'Kota Supplier', value: 'kota_supp', filterable: false },
      { text: 'Status', value: 'status', filterable: false },
      { text: 'Tanggal Pemesanan', value: 'tanggal', filterable: false },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Detail', value: 'detail', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    headers2: [
      { text: 'Nama Produk', value: 'namaProduk', filterable: false, sortable: false  },
      { text: 'Jumlah', value: 'jumlah', filterable: false, sortable: false },
      { text: 'Satuan', value: 'satuan', filterable: false, sortable: false  },
    ],
    transpem: [],
    deleted: [],
    temp: [],
    tes: '',
    Det: false,
    produk: [],
    supplier: [],
    penampung: 0,
    listItem: [],
    prod: [],
    supp: [],
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      idProduk: '',
      namaProduk: '',
      jumlah: 0,
      satuan: '',
      status: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      idProduk: '',
      namaProduk: '',
      jumlah: 0,
      satuan: '',
      status: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    namaBulan : [
      "Januari", 
      "Februari", 
      "Maret", 
      "April", 
      "Mei", 
      "Juni", 
      "Juli", 
      "Agustus", 
      "September", 
      "Oktober", 
      "November", 
      "Desember"],
      tahun : '',
      bulan: ''
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
      axios.get("http://luxinoire.com/api/showPemesananPembayaran").then(response => {
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].status != "Lunas" && this.temp[i].logAksi != "Deleted") {
                this.transpem.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
    },

    editItem (item) {
      this.editedIndex = this.transpem.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.prod = []
      this.supp = []
      this.prod.nama = this.editedItem["namaProduk"]
      this.supp.nama = this.editedItem["namaSupp"]
      console.log(this.prod.nama)
      this.dialog = true
    },

    detailItem(kode) {
        this.Det = true
        this.listItem = []
        axios.get("http://luxinoire.com/api/searchTransaksiPemesanan/"+kode).then(response => {
            this.listItem = response.data
        });
    },

    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    BulanTahun(kode) {
       this.bulan = kode.charAt(8) + kode.charAt(9)
       this.tahun = kode.charAt(5) + kode.charAt(6)
       this.tahun = parseInt(this.tahun) + 2000
       this.bulan = this.namaBulan[parseInt(this.bulan)-1]
    },

    cekProduk(produk,pemesanan) {
      var stat = false
      axios.get("http://luxinoire.com/api/searchLaporanPemesananTahun/"+this.tahun).then(response => {
          this.temp = response.data
          for(var i in response.data) {
             if(produk.nama == this.temp[i].nama_produk && this.bulan == this.temp[i].bulan) {
                this.restockLaporanProduk(produk, this.temp[i].id, pemesanan.jumlah)
                stat = true
             }
          }
          if(stat != true) {
            
            axios
              .post("http://luxinoire.com/api/createLaporanPemesanan", {
                  nama_produk: produk.nama,
                  jumlah_dipesan : pemesanan.jumlah,
                  total_pemesanan: produk.harga / 2,
                  tahun: this.tahun,
                  bulan: this.bulan
              })
              .then(response => {
                console.log(response.data)
              })
          }
        })
    },

    restockLaporanProduk(item, id, jumlah) {
        this.penam = 0
        this.penTot = 0
        axios.get("http://luxinoire.com/api/searchLaporanPemesanan/"+id).then(response => {
            this.penam = response.data.jumlah_dipesan+jumlah
            this.penTot = response.data.total_pemesanan+(item.harga / 2)
            axios
            .put("http://luxinoire.com/api/updateLaporanPemesanan/"+id, {
                jumlah_dipesan: this.penam,
                total_pemesanan: this.penTot
            })
            .then(response => {
              console.log(response.data)
            })
        })
    },


    lunas(item) {
      const index = this.transpem.indexOf(item)
      confirm('Update Stok Produk ?')&&this.transpem.splice(index, 1)&&
      axios
        .put("http://luxinoire.com/api/updatePemesananPembayaran/"+item.id, {
            status: "Lunas"
        })
        .then(response => {
            console.log(response.data)
        })&&
      this.restock(item)
      &&
      this.reloadData()
    },


    restock(item) {
      this.BulanTahun(item.id_transaksi)
      axios.get("http://luxinoire.com/api/searchTransaksiPemesanan/"+item.id_transaksi).then(response => {
            this.temp = response.data
            for(var i in response.data) {
                this.aserehe(this.temp[i])
            }
      }); 
    }, 

    aserehe(item) {
        this.loading = true
        this.jual = 0
        axios.get("http://luxinoire.com/api/searchProduk/"+item.idProduk).then(response => {
            this.penampung = response.data.stok + item.jumlah
            this.cekProduk(response.data,item)
            console.log(this.penampung)
            axios.put("http://luxinoire.com/api/updateProduk/"+item.idProduk, {
                stok: this.penampung
            })
            this.loading = false
        });
    },

    deleteItem (item) {
      const index = this.transpem.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Hapus Item?') && this.transpem.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updatePemesananPembayaran/"+temp["id"], {
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
        Object.assign(this.transpem[this.editedIndex], this.editedItem)
        axios
        .put("http://luxinoire.com/api/updateTransaksiPemesanan/"+this.editedItem["id"], {
            namaProduk: this.editedItem["namaProduk"],
            idProduk: this.editedItem["idProduk"],
            jumlah: this.editedItem["jumlah"],
            satuan: this.editedItem["satuan"],
            logAksi: "Diubah",
            logAktor: this.$cookies.get(this.$user).nama,
            logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        });
        this.reloadData()
      } else {
          axios
          .post("http://luxinoire.com/api/createTransaksiPemesanan", {
                id_transaksi: this.kode,
                namaProduk: this.editedItem["namaProduk"],
                idProduk: this.editedItem["idProduk"],
                jumlah: this.editedItem["jumlah"],
                satuan: this.editedItem["satuan"],
                logAksi: "Ditambahkan",
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