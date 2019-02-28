import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import money from 'v-money'

// Vue.use es solamente para agregar plugins a Vue, no para importar cualquier libreria.
Vue.use(money)
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
