<template>
    <v-data-table
    :headers="headers"
    :items="hewan"
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
          color= "#30475e"
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
      {{hewan.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
            hewan: [],
            search:'',
            headers: [
            {
                text: 'No.',
                align: 'start',
                sortable: false,
                value: 'id',
                filterable: false 
            },
            { text: 'Nama Hewan', value: 'nama', },
            { text: 'Tanggal Lahir', value: 'tglLahir', sortable: false, filterable: false  },
            { text: 'Jenis Hewan', value: 'jenisHewan', filterable: false, sortable: false },
            { text: 'Pemilik', value: 'customer', filterable: false },
            { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
            { text: 'Log', value: 'logs', filterable: false, sortable: false },
            ],
        }
    },
    created() {
        this.$user.role = this.$cookies.get(this.$user).role
        axios.get("http://luxinoire.com/api/deletedHewan").then(response => {
        this.hewan = response.data
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
    methods: {
        restore(item) {
            const index = this.hewan.indexOf(item)
            var temp = Object.assign({}, item)
            console.log(temp["id"])
            confirm('Kembalikan item?') && this.hewan.splice(index, 1)&&
            axios
            .put("http://luxinoire.com/api/updateHewan/"+item["id"], {
                logAksi: 'Dikembalikan',
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
            })
            .then(response => {
                console.log(response.data)
            });
        },
        deleteItem(item) {
          const index = this.hewan.indexOf(item)
          var temp = Object.assign({}, item)
          console.log(temp["id"])
          confirm('Hapus Permanen Item?') && this.hewan.splice(index, 1) &&
          axios.delete("http://luxinoire.com/api/deleteHewan/"+ temp["id"])
          .then(response => {
            console.log(response)
          });
        }
    }
}
</script>