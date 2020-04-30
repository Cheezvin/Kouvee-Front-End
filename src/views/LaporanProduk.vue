<template>
  <v-data-table
    :headers="headers"
    :items="report"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Laporan Produk</v-toolbar-title>
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
      </v-toolbar>
    </template>
    <template v-slot:item.id="{item}">
      {{report.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:footer>
      <v-toolbar flat color="white" class="mt-8 mb-2 ml-12">
        <v-spacer/>
          <v-btn dark color="red" @click="cetakLaris">
            Produk Terlaris
          </v-btn>
          <v-btn class="ml-2" dark color="indigo" @click="cetakTahunan">
            Pendapatan Tahunan
          </v-btn>
          <v-btn class="ml-2" dark color="indigo" @click="cetakBulanan">
            Pendapatan Bulanan
          </v-btn>
        <v-spacer/>
      </v-toolbar>
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
      { text: 'Bulan', value: 'bulan', },
      { text: 'Tahun', value: 'tahun', },
      { text: 'Nama Produk', value: 'nama_produk', },
      { text: 'Jumlah Penjualan', value: 'jumlah_terjual', sortable: false, filterable: false },
      { text: 'Total Penjualan', value: 'total_penjualan', sortable: false, filterable: false },
      
    ],
    report: [],
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
    stats: false,
    temp2: [],
    kode: '',
    penampung: 0,
    lapproduk:[],
    loading: false,
    produk2: [],
    hewan: [],
    custData: [],
    bulan: '',
    tahun: '',
    editedIndex: -1,
    bulanSk: '',
    tahunSk: '',
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
      "Desember"]
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
      this.$adminDrawer.value = true
      this.$user.role = this.$cookies.get(this.$user).role
      this.init()
    }
    else {
      this.$router.push("/menu/login")
    }
  },

  methods: {
    init() {
      axios.get("http://luxinoire.com/api/showLaporanProduk").then(response => {
        this.report = response.data
      })
    },

    cetakLaris() {
      let current_datetime = new Date()
      confirm("Cetak Laporan Produk Terlaris ?")
      &&window.open("http://luxinoire.com/api/reportProdukLaris/"+current_datetime.getFullYear(), "_blank")
    },

    cetakTahunan() {
      let current_datetime = new Date()
      confirm("Cetak Laporan Pendapatan Pertahun ?")
      &&window.open("http://luxinoire.com/api/reportPendapatanTahun/"+current_datetime.getFullYear(), "_blank")
    },

    cetakBulanan() {
      confirm("Cetak Laporan Pendapatan Perbulan ?")
      &&window.open("http://luxinoire.com/api/reportPerbulan", "_blank")
    },
  }
}
</script>