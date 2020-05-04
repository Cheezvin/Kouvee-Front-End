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
         <v-img
          class=" mt-1 hidden-sm-and-down mb-4 mr-auto ml-auto"
          src="../assets/logokouvee.png"
          width="800"
          to="/layanan"
        />
        <v-toolbar-title style="color: white;" class="text-center display-3 pb-5">Produk Kami</v-toolbar-title>
        <v-toolbar
          class="mb-1"
          elevation="0"
          color="#222831"
          style="border-radius:10px;"
        >
          <v-icon dark color="#f2a365" class="mr-2">mdi-magnify</v-icon>
          <v-text-field
            v-model="search"
            clearable
            dark
            solo-inverted
            color="#f2a365"
            background-color="#f2a365"
            hide-details
            label="Search"
          ></v-text-field>
          <v-toolbar
          class="mb-1"
          elevation="0"
          color="#222831"
          width="1"
          style="border-radius:10px;"
        >
        <v-icon dark color="#f2a365" class="mr-2">mdi-sort-descending</v-icon>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-select
              v-model="sortBy"
              background-color="#f2a365"
              solo
              dark
              hide-details
              :items="keys"
              label="Sort by"
            ></v-select>
          </template>
        </v-toolbar>
        </v-toolbar>        
      </template>

      <template v-slot:default="props" >
        <v-row>
          <v-col v-for="p in props.items" :key="p.nama" cols="2">
             <v-card style="border-radius:10px;" color="#ececec" >
             <v-img class="text-center" height="200" :src="p.gambar"></v-img>
              <v-card-subtitle class="font-weight-black text-center text-truncate">{{p.nama}}</v-card-subtitle>
              <v-card-text class="font-weight-medium" color="orange lighten-3">
                <div>
                  IDR {{p.harga}}
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
            'Stok',
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

