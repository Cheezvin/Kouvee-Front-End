<template>
  <v-app style="background-color: #e7e7e7;" >

    <!--Customer-->
    <v-app-bar v-if="$customerBar.value" app  color="primary" dark>
      <div class="d-flex align-left mb-2" to="/layanan">
        <v-img
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/logokouvee.png"
          width="130"
          to="/layanan"
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
        <v-list-item>
            <v-list-item-title class="text-center font-weight-black">
              <v-icon>mdi-human-male</v-icon>
              Main Data
            </v-list-item-title>
        </v-list-item>
        <v-list-item to="/menu-product" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-layanan" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-pegawai" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Pegawai</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-supplier" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Supplier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-customer">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Customer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-hewan">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-ukuran">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ukuran Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-jenis">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Jenis Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item>
            <v-list-item-title class="text-center font-weight-black">
              <v-icon>mdi-cart</v-icon>
              Transaksi
            </v-list-item-title>
        </v-list-item>
        <v-list-item to="/menu-tpp" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item to="/menu-tpl" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-transaksi-pembayaran" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Pembayaran</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/menu-transaksi-pemesanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Pemesanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-title class="text-center font-weight-black">
              <v-icon>mdi-clipboard-text</v-icon>
              Report
            </v-list-item-title>
        </v-list-item>
         <v-list-item to="/laporan-produk" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item to="/laporan-layanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/laporan-pemesanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Pemesanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      

      <template v-slot:append class="grey lighten-5">
        <div class="pa-2">
          <v-btn @click="logout" class="grey darken-4" style="color: white;" block>Logout</v-btn>
        </div>
      </template>
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
  methods: {
    logout() {
      confirm('Are you sure you want to logout ?')&&this.clearCookies()
    },
    clearCookies() {
      this.$cookies.remove(this.$isLogin.value)
      this.$cookies.remove(this.$user)
      this.$router.push("/menu/login")
    }
  }
}
</script>
