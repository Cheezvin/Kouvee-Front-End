<template>
    <v-data-table
    :headers="headers"
    :items="hewan"
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
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
  </template>
    <template v-slot:item.logs="{item}">
      {{item.logAksi}} by {{item.logAktor}} on {{item.logWaktu}}
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
    data() {
        return{
            hewan: [],
            search:'',
            headers: [
            {
                text: 'ID',
                align: 'start',
                sortable: false,
                value: 'id',
                filterable: false 
            },
            { text: 'Nama Hewan', value: 'nama', },
            { text: 'Tanggal Lahir', value: 'tglLahir', sortable: false, filterable: false  },
            { text: 'Jenis Hewan', value: 'jenisHewan', filterable: false, sortable: false },
            { text: 'Pemilik', value: 'customer', filterable: false },
            { text: 'Actions', value: 'actions', sortable: false, filterable: false  },
            { text: 'Log', value: 'logs', filterable: false, sortable: false },
            ],
        }
    },
    created() {
        axios.get("http://luxinoire.com/api/showHewan").then(response => {
        this.temp = response.data
        for(var i in response.data) {
            if(this.temp[i].logAksi == "Deleted") {
                this.hewan.push(this.temp[i])
            }
        }
      });
      this.$adminDrawer.value = true
      console.log(this.$adminDrawer.value)
    },
    methods: {
        restore(item) {
            const index = this.hewan.indexOf(item)
            var temp = Object.assign({}, item)
            console.log(temp["id"])
            confirm('Are you sure you want to restore this item?') && this.hewan.splice(index, 1)&&
            axios
            .put("http://luxinoire.com/api/updateHewan/"+item["id"], {
                logAksi: 'Restored'
            })
            .then(response => {
                console.log(response.data)
            });
        },
        deleteItem(item) {
          const index = this.hewan.indexOf(item)
          var temp = Object.assign({}, item)
          console.log(temp["id"])
          confirm('Are you sure you want to delete this item?') && this.hewan.splice(index, 1) &&
          axios.delete("http://luxinoire.com/api/deleteHewan/"+ temp["id"])
          .then(response => {
            console.log(response)
          });
        }
    }
}
</script>