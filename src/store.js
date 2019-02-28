import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    headers: [
      { text: 'Fecha', value: 'fecha' },
      { text: 'Monto', value: 'monto' },
      { text: 'Proveedor', value: 'proveedor' },
      { text: 'Número de factura', value: 'numeroFactura' },
      { text: 'Concepto', value: 'concepto' },
      { text: 'Cuenta', value: 'cuenta' },
      { text: 'Año', value: 'año' },
      { text: 'Comentarios', value: 'comentarios' }
    ],
    datosprecargados: [],
    datosTabla: [],
    editedIndex: -1,
    editedItem: {
      fecha: '',
      monto: '',
      comentarios: '',
      proveedor: '',
      numeroFactura: '',
      concepto: '',
      cuenta: '',
      cuota: '',
      año: ''
    },
    defaultItem: {
      fecha: '',
      monto: '',
      comentarios: '',
      proveedor: '',
      numeroFactura: '',
      concepto: '',
      cuenta: '',
      cuota: '',
      año: ''

    }
  },
  actions:
  {
    async cargaDatos (state) {
      try {
        const httpDataPromise = await axios.get('http://sinos.unsam.edu.ar/cuestor')
        console.log(httpDataPromise)
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
  mutations:
  {
    SET_DATA (state, httpData) {
      state.datosTabla = httpData
    }
  }
})
