<template>
    <v-data-table
    :headers="headers"
    :items="layanan"
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
          label="Cari"
          single-line
          color= "#30475e"
          hide-details
        ></v-text-field>
      </v-toolbar>
  </template>
  <template v-slot:item.gambar="{item}">
      <v-img class="text-center ml-12" height="150" width="130" :src="item.gambar"></v-img>
    </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{layanan.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
            layanan: [],
            search:'',
            headers: [
            {
                text: 'No.',
                align: 'start',
                sortable: false,
                value: 'id',
                filterable: false 
            },
            { text: '', value: 'gambar', sortable: false, filterable: false },
            { text: 'Nama Layanan', value: 'nama', },
            { text: 'Harga', value: 'harga', filterable: false  },
            { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
            { text: 'Log', value: 'logs', filterable: false, sortable: false },
            ],
        }
    },
    created() {
        this.$user.role = this.$cookies.get(this.$user).role
        axios.get("http://luxinoire.com/api/deletedLayanan").then(response => {
        this.layanan = response.data
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
    methods: {
        restore(item) {
            const index = this.layanan.indexOf(item)
            var temp = Object.assign({}, item)
            console.log(temp["id"])
            confirm('Kembalikan Item?') && this.layanan.splice(index, 1)&&
            axios
            .put("http://luxinoire.com/api/updateLayanan/"+item["id"], {
                logAksi: 'Dikembalikan',
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
            })
            .then(response => {
                console.log(response.data)
            });
        },
        deleteItem(item) {
          const index = this.layanan.indexOf(item)
          var temp = Object.assign({}, item)
          console.log(temp["id"])
          confirm('Hapus Permanen Item?') && this.layanan.splice(index, 1) &&
          axios.delete("http://luxinoire.com/api/deleteLayanan/"+ temp["id"])
          .then(response => {
            console.log(response)
          });
        }
    }
}
</script>