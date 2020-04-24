import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyCOjUfFNEzxatJlbpOj9omGkHeoKhDoW3I",
  authDomain: "kouvee-17f92.firebaseapp.com",
  databaseURL: "https://kouvee-17f92.firebaseio.com",
  projectId: "kouvee-17f92",
  storageBucket: "kouvee-17f92.appspot.com",
  messagingSenderId: "1098546987808",
  appId: "1:1098546987808:web:9cdf4c6b49ee1feb81cd45"
};
Vue.prototype.fb = firebase.initializeApp(firebaseConfig);
Vue.prototype.$isLogin = Vue.observable({ value: 'logout' });
Vue.prototype.$date = Vue.observable({ value: 'default' });
Vue.prototype.$incrementP = Vue.observable({ value: 1 });
Vue.prototype.$incrementL = Vue.observable({ value: 1 });
Vue.prototype.$incrementPO = Vue.observable({ value: 1 });
Vue.prototype.$user = Vue.observable({role: ''});
Vue.prototype.$adminDrawer = Vue.observable({ value: false });
Vue.prototype.$customerBar = Vue.observable({ value: false });
Vue.use(VueRouter)
Vue.use(VueCookies)

//Components and View
import Login from '../views/Login.vue'
import Welcome from '../components/WelcomePage.vue'
import ProdMan from '../views/ProductManage.vue'
import LayMan from '../views/LayananManage.vue'
import Produk from '../components/ProductList.vue'
import DelProduk from '../components/DeletedProduk.vue'
import Layanan from '../components/LayananList.vue'
import DelLayanan from '../components/DeletedLayanan.vue'
import Pegawai from '../views/PegawaiManage.vue'
import DelPegawai from '../components/DeletedPegawai.vue'
import Supplier from '../views/SupplierManage.vue'
import DelSupplier from '../components/DeletedSupplier.vue'
import Customer from '../views/CustomerManage.vue'
import DelCust from '../components/DeletedCustomer.vue'
import UkuranHewan from '../views/UkuranHewanManage.vue'
import DelUH from '../components/DeletedUkuranHewan.vue'
import JenisHewan from '../views/JenisHewanManage.vue'
import DelJH from '../components/DeletedJenisHewan.vue'
import Hewan from '../views/HewanManage.vue'
import DelHewan from '../components/DeletedHewan.vue'
import TPP from '../views/TPP.vue'
import TPPList from '../components/TPPList.vue'
import DelTPP from '../components/DeletedTPP.vue'
import TPL from '../views/TPL.vue'
import TPLList from '../components/TPLList.vue'
import DelTPL from '../components/DeletedTPL.vue'
import TransaksiPembayaran from '../views/TransaksiPembayaran.vue'
import DelTranspem from '../components/DeletedTransaksiPembayaran.vue'
import TransaksiPemesanan from '../views/TransaksiPemesanan.vue'
import DelTranspemesanan from '../components/DeletedTransaksiPemesanan.vue'
import PemesananPembayaran from '../components/PemesananPembayaranList.vue'
import DelPemesananPembayaran from '../components/DeletedPemesananPembayaran.vue'

const routes = [
  {
    path: '/',
    name: 'ProductList',
    component: Produk
  },
  {
    path: '/menu-transaksi-pembayaran',
    name: 'TransaksiPembayaran',
    component: TransaksiPembayaran
  },
  {
    path: '/menu-pemesanan-list',
    name: 'PemesananPembayaran',
    component: PemesananPembayaran
  },
  {
    path: '/menu-transaksi-pemesanan',
    name: 'TransaksiPemesanan',
    component: TransaksiPemesanan
  },
  {
    path: '/menu',
    name: 'Welcome Page',
    component: Welcome
  },
  {
    path: '/menu-tpp',
    name: 'Transaksi Produk',
    component: TPP
  },
  {
    path: '/menu-tpl',
    name: 'Transaksi Layanan',
    component: TPL
  },
  {
    path: '/menu-supplier',
    name: 'Supplier',
    component: Supplier
  },
  {
    path: '/menu-jenis',
    name: 'JenisHewan',
    component: JenisHewan
  },
  {
    path: '/menu-hewan',
    name: 'Hewan',
    component: Hewan
  },
  {
    path: '/menu/deleted-hewan',
    name: 'Deleted Hewan',
    component: DelHewan
  },
  {
    path: '/menu/deleted-produk',
    name: 'Deleted Produk',
    component: DelProduk
  },
  {
    path: '/menu/deleted-layanan',
    name: 'Deleted Layanan',
    component: DelLayanan
  },
  {
    path: '/menu/deleted-transaksi-pembayaran',
    name: 'Deleted Transaksi Pembayaran',
    component: DelTranspem
  },
  {
    path: '/menu/deleted-transaksi-pemesanan',
    name: 'Deleted Transaksi Pemesanan',
    component: DelTranspemesanan
  },
  {
    path: '/menu/deleted-pemesanan-pembayaran',
    name: 'Deleted Pemesanan Pembayaran',
    component: DelPemesananPembayaran
  },
  {
    path: '/menu-ukuran',
    name: 'UkuranHewan',
    component: UkuranHewan
  },
  {
    path: '/menu/deleted-customer',
    name: 'DeletedCustomer',
    component: DelCust
  },
  {
    path: '/menu/deleted-tpp',
    name: 'DeletedTPP',
    component: DelTPP
  },
  {
    path: '/menu/tpp-list',
    name: 'TPPList',
    component: TPPList
  },
  {
    path: '/menu/deleted-tpl',
    name: 'DeletedTPL',
    component: DelTPL
  },
  {
    path: '/menu/deleted-supplier',
    name: 'Deleted Supplier',
    component: DelSupplier
  },
  {
    path: '/menu/deleted-pegawai',
    name: 'Deleted Pegawai',
    component: DelPegawai
  },
  {
    path: '/menu/tpl-list',
    name: 'TPLList',
    component: TPLList
  },
  {
    path: '/menu/deleted-ukuran',
    name: 'DeletedUkuranHewan',
    component: DelUH
  },
  {
    path: '/menu/deleted-jenis',
    name: 'DeletedJenisHewan',
    component: DelJH
  },
  {
    path: '/menu-customer',
    name: 'Customer',
    component: Customer
  },
  {
    path: '/menu-pegawai',
    name: 'PegawaiManage',
    component: Pegawai
  },
  {
    path: '/menu-product',
    name: 'Product',
    component: ProdMan
  },
  {
    path: '/menu/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/menu-layanan',
    name: 'Layanan',
    component: LayMan
  },
  {
    path: '/layanan',
    name: 'LayananList',
    component: Layanan
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
