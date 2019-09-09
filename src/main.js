import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/style/main.scss'
import '@/assets/js/main.js'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.min.css'
import api from '@/api/api'
import '@/assets/font/iconfont.css'

Vue.use(Mint)

Vue.config.productionTip = false
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
