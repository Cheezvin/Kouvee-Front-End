<template>
    <v-data-table
    :headers="headers"
    :items="ukuran"
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
          color= "#30475e"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
  </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} Oleh {{item.logAktor}} Pada {{item.logWaktu}}
    </template>
    <template v-slot:item.id="{item}">
      {{ukuran.map(function(x) {return x.id; }).indexOf(item.id)+1}}
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
            ukuran: [],
            search:'',
            headers: [
                {
                    text: 'No.',
                    align: 'start',
                    sortable: false,
                    value: 'id',
                    filterable: false 
                },
                { text: 'Ukuran Hewan', value: 'nama', },
                { text: 'Aksi', value: 'actions', sortable: false, filterable: false  },
                { text: 'Log', value: 'logs', filterable: false, sortable: false },
            ],
        }
    },
    created() {
        this.$user.role = this.$cookies.get(this.$user).role
        axios.get("http://luxinoire.com/api/deletedUkuranHewan").then(response => {
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi == "Dihapus") {
                this.ukuran.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
    methods: {
        restore(item) {
            const index = this.ukuran.indexOf(item)
            var temp = Object.assign({}, item)
            console.log(temp["id"])
            confirm('Kembalikan Item?') && this.ukuran.splice(index, 1)&&
            axios
            .put("http://luxinoire.com/api/updateUkuranHewan/"+item["id"], {
                logAksi: 'Dikembalikan',
                logAktor: this.$cookies.get(this.$user).nama,
                logWaktu: new Date().toLocaleString()
            })
            .then(response => {
                console.log(response.data)
            });
        },
        deleteItem(item) {
          const index = this.ukuran.indexOf(item)
          var temp = Object.assign({}, item)
          console.log(temp["id"])
          confirm('Hapus Item?') && this.ukuran.splice(index, 1) &&
          axios.delete("http://luxinoire.com/api/deleteUkuranHewan/"+ temp["id"])
          .then(response => {
            console.log(response)
          });
        }
    }
}
</script>