<template>
  <v-container>
    <v-data-iterator
      :items="items"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      disable-pagination
       hide-default-footer>
      
       <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-select
              class="ml-12"
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              label="Sort by"
            ></v-select>
          </template>
        </v-toolbar>
      </template>
      
      <template v-slot:default="props" >
        <v-row>
          <v-col v-for="p in props.items" :key="p.nama" cols="2">
             <v-card>
             <v-img class="text-center" height="200" :src="p.gambar"></v-img>
              <v-card-subtitle class="font-weight-black green--text text-center text-truncate">{{p.nama}}</v-card-subtitle>
              <v-card-text class="orange--text">
                <div>
                  Harga : {{p.harga}}
                </div>
                <div>
                  Stok : {{p.stok}}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import axios from 'axios';
  export default {
    data() {
        return {
            sortDesc: false,
            sortBy: 'nama',
            items: [],
            search: '',
            filter: {},
            keys: [
            'Nama',
            'Harga',
          ],
        }
    },
    computed: {
      filteredKeys () {
        return this.keys.filter(key => key !== `Nama`)
      },
    },
    created() {
    axios.get("http://luxinoire.com/api/showProduk").then(response => {
        this.items = response.data;
        console.log(this.products)
      });
      this.$customerBar.value = true
    },
  }
</script>

