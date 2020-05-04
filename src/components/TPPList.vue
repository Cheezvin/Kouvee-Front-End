<template>
  <v-data-table
    :headers="headers"
    :items="tpp"
    :search="search"
    style="color: #30475e;"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title style="color: #30475e;">List TPP</v-toolbar-title>
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
          color= "#30475e"
          single-line
          hide-details
        ></v-text-field>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn  dark color="#f2a365" v-on="on" to="/menu/deleted-tpp">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-1" dark color="#f2a365" v-on="on">
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
                     ID Transaksi :
                    <v-select
                      v-model="kode"
                      :items="idTrans"
                      label="ID Transaksi"
                      return-object
                      flat
                      solo-inverted
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                     Nama Produk :
                    <v-select
                      v-model="selected"
                      :items="produk"
                      item-text="nama"
                      label="Nama Produk"
                      return-object
                      flat
                      solo-inverted
                      @change="lucu"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field type="number" min="1" max="50" v-model="editedItem.jumlah" label="Jumlah"></v-text-field>
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

        <v-dialog v-model="ngedit" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Transaction</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                 <v-col cols="12">
                     Nama Produk :
                    <v-select
                      v-model="selected"
                      :items="produk"
                      item-text="nama"
                      label="Nama Produk"
                      return-object
                      flat
                      solo-inverted
                      @change="lucu"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field type="number" min="1" max="50" v-model="editedItem.jumlah" label="Jumlah"></v-text-field>
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
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{tpp.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
      { text: 'Nama Produk', value: 'nama_produk', },
      { text: 'Harga', value: 'harga', sortable: false, filterable: false  },
      { text: 'Jumlah', value: 'jumlah', sortable: false, filterable: false  },
      { text: 'Subtotal', value: 'subtotal', sortable: false, filterable: false  },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    tpp: [],
    deleted: [],
    temp: [],
    penampung: 0,
    kode: '',
    total: 0,
    produk:[],
    idTrans: [],
    tempItem: [],
    selectedFile: null,
    editedIndex: -1,
    editedItem: {
      id: 0,
      id_transaksi: '',
      id_produk: '',
      nama_produk: '',
      harga: '',
      jumlah: '',
      subtotal: '',
      status: '',
      tanggal: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    defaultItem: {
      id: 0,
      id_transaksi: '',
      id_produk: '',
      nama_produk: '',
      harga: '',
      jumlah: '',
      subtotal: '',
      status: '',
      tanggal: '',
      logAksi: '',
      logAktor: '',
      logWaktu: ''
    },
    selected: []
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
      axios.get("http://luxinoire.com/api/showTPP").then(response => {
        this.tpp = []
        this.temp = response.data
        for(var i in response.data) {
          if(this.temp[i].logAksi != "Dihapus") {
              this.tpp.push(this.temp[i])
              this.idTrans.push(this.temp[i].id_transaksi)
          }
        }
      });
      
      this.selected = []
      this.reloadProduk()

      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
      
    },

    reloadProduk() {
      axios.get("http://luxinoire.com/api/showProduk").then(response => {
        this.produk = []
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].stok > 0) {
                this.produk.push(this.temp[i])
            }
        }
      });
    },

    lucu() {
      this.reloadProduk()
      this.editedItem["nama_produk"] = this.selected.nama
      this.editedItem["harga"] = this.selected.harga
      this.editedItem["id_produk"] = this.selected.id
      console.log(this.selected)
    },

    editItem (item) {
      this.selected = []
      this.tempItem = Object.assign({}, item)
      this.penampung = 0
      console.log(this.tempItem)
      axios.get("http://luxinoire.com/api/searchProduk/"+item.id_produk).then(response => {
          this.selected = response.data
          this.penampung = response.data.stok + this.editedItem["jumlah"]
          console.log(this.penampung)
      });
      this.editedIndex = this.tpp.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.kode = item.id_transaksi
      this.ngedit = true
    },

    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    restock(item) {
      axios.get("http://luxinoire.com/api/searchProduk/"+item.id_produk).then(response => {
          this.penampung = response.data.stok + item.jumlah
          console.log(this.penampung)
      });
      var self = this
      var id = item.id_produk
      setTimeout(function() {
        axios.put("http://luxinoire.com/api/updateProduk/"+id, {
          stok: self.penampung
        })
      }, 1500);

    }, 

    hitungTotal(kode) {
      var self = this
      var id = kode
      this.total = 0
      setTimeout(function() {
        axios.get("http://luxinoire.com/api/searchTPP/"+id).then(response => {
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

    deleteItem (item) {
      const index = this.tpp.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Hapus Item?') && this.tpp.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTPP/"+temp["id"], {
          logAksi: "Dihapus" ,
        })
        .then(response => {
          console.log(response.data)
        })&&
        this.restock(item)
        this.hitungTotal(item.id_transaksi)
        this.reloadData()
    },

    close () {
      this.dialog = false
      this.ngedit = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if(this.editedItem["jumlah"] > this.selected.stok || this.editedItem["jumlah"] < 1) {
        alert("Jumlah barang melebihi atau dibawah jumlah stok")
      }
      else {
        if (this.editedIndex > -1) { 
          Object.assign(this.tpp[this.editedIndex], this.editedItem)
          console.log(this.tempItem["nama_produk"] + this.editedItem["nama_produk"])
            if(this.tempItem["nama_produk"] != this.editedItem["nama_produk"]) {
              axios
              .put("http://luxinoire.com/api/updateTPP/"+this.editedItem["id"], {
                id_produk: this.editedItem["id_produk"],
                nama_produk: this.editedItem["nama_produk"],
                harga: this.editedItem["harga"],
                jumlah: this.editedItem["jumlah"],
                subtotal: this.editedItem["jumlah"] * this.editedItem["harga"],
                logAksi: "Edited",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
              })
              .then(response => {
                console.log(response.data)
              });
              this.restock(this.tempItem)
              axios.put("http://luxinoire.com/api/updateProduk/"+this.editedItem["id_produk"], {
                    stok: this.selected.stok - this.editedItem["jumlah"]
              })
            }
            else {
               axios
              .put("http://luxinoire.com/api/updateTPP/"+this.editedItem["id"], {
                harga: this.editedItem["harga"],
                jumlah: this.editedItem["jumlah"],
                subtotal: this.editedItem["jumlah"] * this.editedItem["harga"],
                logAksi: "Diubah",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
              })
              .then(response => {
                console.log(response.data)
              });
            
              axios.put("http://luxinoire.com/api/updateProduk/"+this.editedItem["id_produk"], {
                stok: this.penampung - this.editedItem["jumlah"]
              })
            }
          } 
          else {
            console.log(this.kode)
              axios
              .post("http://luxinoire.com/api/createTPP", {
                    id_transaksi: this.kode,
                    id_produk: this.editedItem["id_produk"],
                    nama_produk: this.editedItem["nama_produk"],
                    harga: this.editedItem["harga"],
                    jumlah: this.editedItem["jumlah"],
                    subtotal: this.editedItem["jumlah"] * this.editedItem["harga"],
                    logAksi: "Ditambahkan",
                    logAktor: this.$cookies.get(this.$user).nama,
                    logWaktu: new Date().toLocaleString()
              })
              .then(response => {
                console.log(response.data)
              });
              

              axios.put("http://luxinoire.com/api/updateProduk/"+this.editedItem["id_produk"], {
                    stok: this.selected.stok - this.editedItem["jumlah"]
              })
            }
        }
        this.hitungTotal(this.kode)
        this.reloadData()
        this.close()
    },
    reloadData() {
      var self = this
      setTimeout(function() {
        self.initialize()
      }, 1500);
    }
  },
}
</script>