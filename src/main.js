import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import currency from 'v-currency-field'

import 'v-currency-field/dist/index.css'

Vue.use(currency)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
