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
          color="#30475e"
          label="Cari"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn   dark color="#f2a365" v-on="on" to="/menu/deleted-transaksi-pemesanan">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-1"  dark color="#f2a365" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn class="mr-1"  dark color="#f2a365" v-on="on" to="/menu-pemesanan-list">
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
                     Nama Produk :
                    <v-select
                      v-model="prod"
                      :items="produk"
                      item-text="nama"
                      label="Nama Produk"
                      return-object
                      flat
                      solo-inverted
                      @change="prodChange"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field type="number" min="1" max="50" v-model="editedItem.jumlah" label="Jumlah"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field min="1" max="50" v-model="editedItem.satuan" label="Satuan"></v-text-field>
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
                     Nama Supplier:
                    <v-select
                      v-model="supp"
                      :items="supplier"
                      item-text="nama"
                      label="Nama Supplier"
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
              <v-btn color="blue darken-1" text @click="createTrans">Save</v-btn>
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
      {{transpem.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:footer>
       <v-toolbar flat color="white" class="mt-8 mb-2 ml-12">
        <v-spacer/>
          <v-btn dark class="px-10 mr-12 py-5" color="#f2a365" @click="buat=true">Buat Transaksi</v-btn>
        <v-spacer/>
       </v-toolbar>
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
      { text: 'Nama Produk', value: 'namaProduk', },
      { text: 'Jumlah', value: 'jumlah', filterable: false, sortable: false },
      { text: 'Satuan', value: 'satuan', filterable: false },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    transpem: [],
    deleted: [],
    temp: [],
    tes: '',
    produk: [],
    supplier: [],
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
      let current_datetime = new Date()
      this.kode = "PO-"+(current_datetime.getFullYear())+"-"+ this.appendLeadingZeroes(current_datetime.getMonth() + 1).toLocaleString()+"-"+ this.appendLeadingZeroes(current_datetime.getDate())+"-"+ this.appendLeadingZeroes(this.$cookies.get(this.$incrementPO.value))
      console.log(this.kode)
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/searchTransaksiPemesanan/"+this.kode).then(response => {
        this.transpem = []
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Dihapus") {
                this.transpem.push(this.temp[i])
            }
        }
      });
      axios.get("http://luxinoire.com/api/showProduk").then(response => {
        this.produk = response.data
      });
      axios.get("http://luxinoire.com/api/showSupplier").then(response => {
        this.supplier = response.data
      });
      this.prod = []
      this.supp = []
      this.$adminDrawer.value = true
    },

    prodChange() {
       this.editedItem["namaProduk"] = this.prod.nama
       this.editedItem["idProduk"] = this.prod.id
       console.log(this.prod)
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

    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    createTrans() {
      if(this.transpem.length != 0) {
        axios
          .post("http://luxinoire.com/api/createPemesananPembayaran", {
              id_transaksi: this.kode,
              nama_supp: this.supp.nama,
              telp_supp: this.supp.noTelp,
              kota_supp: this.supp.kota,
              status: "Pending",
              tanggal: new Date().toLocaleString(),
              logAksi: "Ditambahkan",
              logAktor: this.$cookies.get(this.$user).nama,
              logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
            this.cetakNota(this.kode)
          })
          this.buat = false
          this.$cookies.set(this.$incrementPO.value, parseInt(this.$cookies.get(this.$incrementPO.value))+1)
          this.reloadData()
      }
      else {
        alert("Transaksi Kosong")
      }
    },

    cetakNota(id) {
      confirm("Cetak Surat Pemesanan ?")&&
      window.open("http://luxinoire.com/api/downloadPDFPemesanan/"+id, "_blank")
    },

    restock(item) {
      axios.get("http://luxinoire.com/api/searchProduk/"+item.idProduk).then(response => {
          this.penampung = response.data.stok + item.jumlah
          console.log(this.penampung)
      });
      var self = this
      var id = item.idProduk
      setTimeout(function() {
        axios.put("http://luxinoire.com/api/updateProduk/"+id, {
          stok: self.penampung
        }).then(response => {
          console.log(response.data)
        });
      }, 1000);
    }, 

    deleteItem (item) {
      const index = this.transpem.indexOf(item)
      var temp = Object.assign({}, item)
      console.log(temp["id"])
      confirm('Hapus Item?') && this.transpem.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTransaksiPemesanan/"+temp["id"], {
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