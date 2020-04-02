<template>
  <v-app style="background-color: #e7e7e7;" >

    <!--Customer-->
    <v-app-bar v-if="$customerBar.value" app  color="primary" dark >
      <div class="d-flex align-left mb-2">
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/logokouvee.png"
          width="130"
        />
      </div>
      <v-spacer/>
      <div class="mb-2">
        <v-tabs  background-color="primary" centered dark icons-and-text>
          <v-tab to="/">
            Produk
            <v-icon>mdi-cart</v-icon>
         </v-tab>
          <v-tab to="/layanan">
            Layanan
            <v-icon>mdi-paw</v-icon>
         </v-tab>
          <v-tab>Items</v-tab>
          <v-tab>Another Screen</v-tab>
        </v-tabs>
      </div>   
    </v-app-bar>


    <!--Admin-->
    <div v-if="$adminDrawer.value">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item to="/menu">
          <v-list-item-action >
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-layanan">
          <v-list-item-action>
            <v-icon>mdi-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-pegawai">
          <v-list-item-action>
            <v-icon>mdi-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Pegawai</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-supplier">
          <v-list-item-action>
            <v-icon>mdi-car</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Supplier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-customer">
          <v-list-item-action>
            <v-icon>mdi-human</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Customer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-hewan">
          <v-list-item-action>
            <v-icon>mdi-paw</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-ukuran">
          <v-list-item-action>
            <v-icon>mdi-paw</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ukuran Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-jenis">
          <v-list-item-action>
            <v-icon>mdi-paw</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Jenis Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-img
          alt="Vuetify Name"
          class="shrink hidden-sm-and-down"
          contain
          height="80"
          src="../assets/logokouvee.png"
          width="130"
        />
    </v-app-bar>
    </div>

    <v-content>
        <router-view/>
    </v-content>
  
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    }
  },
}
</script>
