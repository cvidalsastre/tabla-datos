import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    datosTabla: []
  },
  getters: {
    formatDate (state) {
      state.datosTabla
        .map(x => {

        })
    }
  },

  actions: {
    deleteItem (state, item) {
      const datos = item
      state.commit('deleteItem', datos)
    },
    async cargaDatos (state) {
      try {
        const httpDataPromise = await axios.get(
          'http://sinos.unsam.edu.ar/cuestor'
        )
        const httpData = httpDataPromise.data
        state.commit('SET_DATA', httpData)
      } catch (error) {
        console.log('error', error)
      }
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
      console.log(index)
      confirm('Are you sure you want to delete this item?') && state.datosTabla.splice(index, 1)
    }
  }
})
