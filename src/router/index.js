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
Vue.prototype.$user = {};
Vue.prototype.$token = 'default';
Vue.prototype.$adminDrawer = Vue.observable({ value: false });
Vue.prototype.$customerBar = Vue.observable({ value: false });
Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.$cookies.config('1h')

//Components and View
import Login from '../views/Login.vue'
import ProdMan from '../views/ProductManage.vue'
import LayMan from '../views/LayananManage.vue'
import Produk from '../components/ProductList.vue'
import Layanan from '../components/LayananList.vue'
import Pegawai from '../views/PegawaiManage.vue'
import Supplier from '../views/SupplierManage.vue'
import Customer from '../views/CustomerManage.vue'
import DelCust from '../components/DeletedCustomer.vue'
import UkuranHewan from '../views/UkuranHewanManage.vue'
import DelUH from '../components/DeletedUkuranHewan.vue'
import JenisHewan from '../views/JenisHewanManage.vue'
import DelJH from '../components/DeletedJenisHewan.vue'
import Hewan from '../views/HewanManage.vue'
import DelHewan from '../components/DeletedHewan.vue'

const routes = [
  {
    path: '/',
    name: 'ProductList',
    component: Produk
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
    path: '/menu',
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
