<template>
  <v-app style="background-color: #222831;" >

    <!--Customer-->
    <v-app-bar v-if="$customerBar.value" app  color="#30475e" dark>
      <div class="d-flex align-left mb-2">
        <v-img
          class=" mt-1 hidden-sm-and-down"
          contain
          min-width="120"
          src="../assets/logokouvee.png"
          width="130"
          to="/layanan"
        />
      </div>
      <v-spacer/>
      <div class="mb-2">
        <v-tabs class="ml-12"  background-color="#30475e" grow dark>
          <v-tab to="/">
            Produk 
            <v-icon>mdi-cart</v-icon>
         </v-tab>
          <v-tab to="/layanan">
            Layanan 
            <v-icon>mdi-paw</v-icon>
         </v-tab>
          <v-tab to="/aboutus">About Us
            <v-icon>mdi-account</v-icon>
          </v-tab>
        </v-tabs>
      </div>
      <v-spacer/>
      <div class="d-flex align-left subtitle-2">
        Call Center<v-icon>mdi-phone</v-icon>: +62 812 3456 7890
      </div>
    </v-app-bar>

    <!--Admin-->
    <div v-if="$adminDrawer.value">
    <v-navigation-drawer dark color="#222831" v-model="drawer" app>
      <v-list dense>
        <v-list-item v-if="$user.role != 'Kasir'">
            <v-list-item-title style="color: #f2a365;" class="text-center font-weight-black">
              <v-icon color="#f2a365">mdi-human-male</v-icon>
              Main Data
            </v-list-item-title>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-product" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-layanan" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365"  to="/menu-pegawai" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Pegawai</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-supplier" v-if="$user.role == 'Admin'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Supplier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-customer" v-if="$user.role != 'Kasir'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Customer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-hewan" v-if="$user.role != 'Kasir'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-ukuran" v-if="$user.role != 'Kasir'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ukuran Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-jenis" v-if="$user.role != 'Kasir'">
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Jenis Hewan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item>
            <v-list-item-title style="color: #f2a365;" class="text-center font-weight-black">
              <v-icon color="#f2a365">mdi-cart</v-icon>
              Transaksi
            </v-list-item-title>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-tpp">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item color="#f2a365" to="/menu-tpl">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-transaksi-pembayaran" v-if="$user.role != 'CS'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Pembayaran</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/menu-transaksi-pemesanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transaksi Pemesanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-title style="color: #f2a365;" v-if="$user.role == 'Admin'" class="text-center font-weight-black">
              <v-icon color="#f2a365">mdi-clipboard-text</v-icon>
              Laporan
            </v-list-item-title>
        </v-list-item>
         <v-list-item color="#f2a365" to="/laporan-produk" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Produk</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item color="#f2a365" to="/laporan-layanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Layanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="#f2a365" to="/laporan-pemesanan" v-if="$user.role == 'Admin'">
          <v-list-item-action >
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan Pemesanan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" color="#f2a365" dark block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#30475e"
      dark
    >
      <v-app-bar-nav-icon  @click.stop="drawer = !drawer" />
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

    <template>
      <v-footer
        dark
        padless
      >
        <v-card
          class="flex"
          flat
          color="#30475e"
          tile
        >
          <v-card-text class="py-5 white--text text-center">
            {{ new Date().getFullYear() }} — <strong>Kouvee Petshop</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </template>
  
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
