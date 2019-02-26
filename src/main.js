import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import money from 'v-money'
import VueInputAutowidth from 'vue-input-autowidth'
import moment from 'moment'

Vue.use(VueInputAutowidth)
Vue.use(money)
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
Vue.use(moment)
