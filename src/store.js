import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    datosTabla: []
  },
  // getters: {
  //   formatDate (state) {
  //     state.datosTabla
  //       .map(x => {

  //       })
  //   }
  // },

  actions: {
    deleteItem (context, item) {
      context.commit('deleteItem', item)
    },
    async cargaDatos (context) {
      try {
        const httpDataPromise = await axios.get(
          'http://sinos.unsam.edu.ar/cuestor'
        )
        const httpData = httpDataPromise.data
        context.dispatch('formatDatos', httpData)
      } catch (error) {
        console.log('error', error)
      }
    },
    formatDatos (context, datos) {
      const momentFecha = datos.map(d => ({
        ...d,
        fecha: moment(d.fecha).format('YYYY-MM-DD') // .format('dddd, MMMM Do YYYY')
      }))
      context.commit('SET_DATA', momentFecha)
    }
    // cargaDatos (state) {
    //   axios
    //     .get('http://sinos.unsam.edu.ar/cuestor')
    //     .then(data => {
    //       const httpData = data.data
    //       state.commit('SET_DATA', httpData)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // }
  },
  mutations: {
    SET_DATA (state, httpData) {
      state.datosTabla = httpData
    },
    deleteItem (state, item) {
      const index = state.datosTabla.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        state.datosTabla.splice(index, 1)
    }
  }
})
