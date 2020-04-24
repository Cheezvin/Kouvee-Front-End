<template>
  <v-data-table
    :headers="headers"
    :items="tpp"
    :search="search"
    class="elevation-12 mx-12 mt-12 mb-12 pb-2 pt-2 subtitle-2"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mt-2 mb-2">
        <v-toolbar-title>Transaksi Produk</v-toolbar-title>
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
            <v-btn  fab dark color="red" v-on="on" to="/menu/deleted-tpp">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
             <v-btn class="mr-1" fab dark color="indigo" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn class="mr-1" fab dark color="green" v-on="on" to="/menu/tpp-list">
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

        <v-dialog v-model="buat" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Buat Transaksi</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="custData"
                      :items="customer"
                      label="Nama Customer"
                      item-text="nama"
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
      {{tpp.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:footer>
       <v-toolbar flat color="white" class="mt-8 mb-2 ml-12">
        <v-toolbar-title>Total Harga</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-toolbar-title>{{total}}</v-toolbar-title>
        <v-spacer/>
        <v-btn color="primary" class="px-10 mr-12 py-5" @click="buka">Buat Transaksi</v-btn>
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
      { text: 'Nama Produk', value: 'nama_produk', },
      { text: 'Harga', value: 'harga', sortable: false, filterable: false  },
      { text: 'Jumlah', value: 'jumlah', sortable: false, filterable: false  },
      { text: 'Subtotal', value: 'subtotal', sortable: false, filterable: false  },
      { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
      { text: 'Log', value: 'logs', filterable: false, sortable: false },
    ],
    tpp: [],
    deleted: [],
    temp: [],
    penampung: 0,
    kode: '',
    total: 0,
    produk:[],
    customer: [],
    custData:[],
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
      let current_datetime = new Date()
      let formatted_date = this.appendLeadingZeroes(current_datetime.getDate()) + this.appendLeadingZeroes(current_datetime.getMonth() + 1).toLocaleString() + (current_datetime.getFullYear()-2000)
      this.kode = "PR-"+formatted_date+"-"+ this.appendLeadingZeroes(this.$cookies.get(this.$incrementP.value))
      console.log(this.kode)
      this.$user.role = this.$cookies.get(this.$user).role
      axios.get("http://luxinoire.com/api/searchTPP/"+this.kode).then(response => {
        this.tpp = []
        this.temp = response.data
        this.index = response.data.length
        this.total = 0
        for(var i in response.data) {
            if(this.temp[i].logAksi != "Dihapus") {
                this.tpp.push(this.temp[i])
                this.total = this.total + this.temp[i].subtotal
            }
        }
      });
      
      this.selected = []
      this.reloadProduk()

      axios.get("http://luxinoire.com/api/showCustomer").then(response => {
        this.temp = response.data
        this.index = response.data.length
        for(var i in response.data) {
            this.customer.push(this.temp[i])
        }
      });

      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
      
    },

    createTrans() {
      if(this.custData.nama != null ) {
        axios
          .post("http://luxinoire.com/api/createTransaksiPembayaran", {
                id_transaksi: this.kode,
                nama_customer: this.custData.nama ,
                telp_customer: this.custData.noTelp,
                total_harga: this.total,
                diskon: 0,
                status: "Belum Lunas",
                tanggal: new Date().toLocaleString(),
                logAksi: "Ditambahkan",
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
          })
          .then(response => {
            console.log(response.data)
          });
          this.$cookies.set(this.$incrementP.value, parseInt(this.$cookies.get(this.$incrementP.value))+1)
          this.buat = false
      }
      else {
        alert("Pilih Customer")
      }
      this.custData = []
      this.reloadData()
    },

    buka() {
      if(this.total == 0) {
        alert("Transaksi tidak boleh kosong !")
      }
      else {
        this.buat = true
      }
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
      console.log(this.tempItem)
      axios.get("http://luxinoire.com/api/searchProduk/"+item.id_produk).then(response => {
          this.selected = response.data
          this.penampung = response.data.stok + this.editedItem["jumlah"]
          console.log(this.penampung)
      });
      this.editedIndex = this.tpp.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
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

    deleteItem (item) {
      const index = this.tpp.indexOf(item)
      var temp = Object.assign({}, item)
      confirm('Hapus Item?') && this.tpp.splice(index, 1) &&
      axios
        .put("http://luxinoire.com/api/updateTPP/"+temp["id"], {
          logAksi: "Dihapus" ,
          logAktor: this.$cookies.get(this.$user).nama,
          logWaktu: new Date().toLocaleString()
        })
        .then(response => {
          console.log(response.data)
        })&&
        this.restock(item)
        this.reloadData()
    },

    close () {
      this.dialog = false
      this.buat = false
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