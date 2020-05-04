<template>
    <v-data-table
    :headers="headers"
    :items="tpl"
    :search="search"
    style="color: #30475e;"
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
          color= "#30475e"
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
      {{tpl.map(function(x) {return x.id; }).indexOf(item.id)+1}}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        color="green"
        @click="restore(item)"
      >
        mdi-reload
      </v-icon>
      <v-icon
        small
        class="mr-2"
        color="red"
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
    data() {
        return{
            tpl: [],
            search:'',
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
        }
    },
    created() {
        this.$user.role = this.$cookies.get(this.$user).role
        axios.get("http://luxinoire.com/api/deletedTPL").then(response => {
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi == "Dihapus") {
                this.tpl.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
    methods: {
        restore(item) {
            const index = this.tpl.indexOf(item)
            var temp = Object.assign({}, item)
            console.log(temp["id"])
            confirm('Kembalikan Item?') && this.tpl.splice(index, 1)&&
            axios
            .put("http://luxinoire.com/api/updateTPL/"+item["id"], {
                logAksi: 'Dikembalikan',
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
            })
            .then(response => {
                console.log(response.data)
            })
            this.hitungTotal(item.id_transaksi)
        }, 

        deleteItem(item) {
          const index = this.tpl.indexOf(item)
          var temp = Object.assign({}, item)
          console.log(temp["id"])
          confirm('Hapus Permanen Item?') && this.tpl.splice(index, 1) &&
          axios.delete("http://luxinoire.com/api/deleteTPL/"+ temp["id"])
          .then(response => {
            console.log(response)
          });
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
    }
}
</script>