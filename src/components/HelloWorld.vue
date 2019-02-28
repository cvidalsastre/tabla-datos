<template>
  <div>
    <v-toolbar
      flat
      color="#42A5F5"
    >
      <v-toolbar-title>Tabla Montos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="admin"
        color="#64B5F6"
        @click="editable = !editable"
      >Editar</v-btn>
      <v-btn
        v-if="admin"
        color="#64B5F6"
        @click="nuevo"
      >Nuevo</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="datosTabla"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <v-menu
            ref="menuref"
            close-on-content-click
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            open-delay="200"
            v-model="props.item.menu"
          >
            <v-text-field
              input
              single-line
              slot="activator"
              :value="formatDate(props.item.fecha)"
              readonly
            ></v-text-field>
            <v-date-picker
              v-model="props.item.fecha"
              locale="ES-ar"
            >
            </v-date-picker>
          </v-menu>
        </td>
        <td>
          <v-text-field
            input
            v-model.lazy="props.item.monto"
            v-money="moneyConfig"
            :readonly="!editable"
            placeholder="Monto"
            hint="Monto"
            full-width
            single-line
            auto-grow="true"
          >
          </v-text-field>
          <!-- <money
            :readonly="!editable"
            v-model="props.item.monto"
            v-bind="moneyConfig"
            reverse
            full-width
            single-line
            hint="Ingrese Monto"
          ></money> -->
        </td>
        <td>
          <v-text-field
            input
            v-model="props.item.proveedor"
            :readonly="!editable"
            :return-value.sync="props.item.proveedor"
            placeholder="Proveedor"
            hint="Provedoor"
            full-width
            single-line
            auto-grow="true"
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="props.item.numeroFactura"
            :readonly="!editable"
            :return-value.sync="props.item.numeroFactura"
            placeholder="N°Factura"
            hint="N° Factura"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="props.item.concepto"
            :readonly="!editable"
            :return-value.sync="props.item.concepto"
            placeholder="Concepto"
            hint="pone concepto"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="props.item.cuenta"
            :readonly="!editable"
            :return-value.sync="props.item.cuenta"
            placeholder="Cuenta"
            hint="pone cuenta"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            slot="input"
            label="Edit"
            v-model="props.item.año"
            :readonly="!editable"
            :return-value.sync="props.item.año"
            placeholder="Año"
            hint="Año"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            slot="input"
            label="Edit"
            v-model="props.item.comentarios"
            :readonly="!editable"
            :return-value.sync="props.item.comentarios"
            placeholder="Comentario"
            hint="Comentario"
            full-width
            single-line
            comentarios
          >
          </v-text-field>
        </td>
        <td>
          <v-icon
            v-if="editable"
            mediumm
            @click="deleteItem(props.item)"
            left
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary">Reset</v-btn>
      </template>
    </v-data-table>

    <v-flex xs12>
      <v-card
        color="blue-grey darken-2"
        class="white--text"
        :readonly='true'
      >
        <v-card-title primary-title>
          <div>
            <div class="headline">
              Monto Total: <money
                :readonly='true'
                :value='sumaMontos'
                v-bind="moneyConfig"
                single-line
              ></money>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import Dinero from 'dinero.js'
import moment from 'moment'
import { VMoney } from 'v-money'
import { mapState } from 'vuex'
// otra tabla año cuota, fecha, monto(polata), tipo(menu despplegable adicionales(1) reformulacion(2) nada(3))
export default {
  directives: { money: VMoney },
  mounted () { this.$store.dispatch('cargaDatos') },
  data: () => ({
    menu: false,
    moneyConfig: {
      decimal: ',',
      thousands: '.',
      prefix: '$ ',
      precision: 2,
      masked: true,
      allowBlank: false,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    },
    errors: {},
    admin: true,
    editable: true,
    headers: [
      { text: 'Fecha', value: 'fecha' },
      { text: 'Monto', value: 'monto' },
      { text: 'Proveedor', value: 'proveedor' },
      { text: 'Número de factura', value: 'numeroFactura' },
      { text: 'Concepto', value: 'concepto' },
      { text: 'Cuenta', value: 'cuenta' },
      { text: 'Año', value: 'año' },
      { text: 'Comentarios', value: 'comentarios', sortable: false },
      { text: '', value: '', sortable: false }
    ],
    datosprecargados: [{
      fecha: '2034-05-20',
      monto: '1000,23',
      comentarios: 'Ingreso'
    },
    {
      fecha: '2005-05-01',
      monto: '33',
      comentarios: 'Viaticos',
      proveedor: 'isisgeva' }
    ],
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
    }
  }),
  computed: {
    ...mapState({
      headers: state => state.headers,
      datosTabla: state => state.datosTabla }),
    computedDateFormattedMomentjs () {
      return this.datosTabla.fecha ? moment(this.datosTabla.fecha).format('dddd, MMMM Do YYYY') : ''
    },
    sumaMontos () {
      return this.datosTabla
        .map(x => {
          const formatMonto = x.monto.replace('.', '').replace('$', '').trim()
          const conCentavos = /,/g.test(formatMonto)
          return conCentavos
            ? Dinero({ amount: Number(x.monto.replace(/\D/g, '')), currency: 'ARS' })
            : Dinero({ amount: Number(`${x.monto}00`), currency: 'ARS' })
        })
        .reduce((x, y) => x.add(y), Dinero({ amount: 0, currency: 'ARS' }, 0))
        .toUnit()
    }
  },
  props: {
  },
  watch: {
  },
  methods: {
    formatDate (fecha) {
      return moment(fecha).format('DD/MM/YYYY')
    },
    editItem (item) {
      this.editedIndex = this.datosTabla.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
    beforeSuma () {
      this.datosTabla.push(...this.datosprecargados)
    },
    methods: {

      nuevo () {
        this.datosTabla.push({
          fecha: '',
          monto: '',
          comentarios: '',
          proveedor: '',
          numeroFactura: '',
          concepto: '',
          cuenta: '',
          cuota: '',
          año: ''
        })
      },
      deleteItem (item) {
        const index = this.datosTabla.indexOf(item)
        console.log({ index })
        confirm('Are you sure you want to delete this item?') && this.datosTabla.splice(index, 1)
      }
    }
  }
}
</script>
<style scoped>
</style>
