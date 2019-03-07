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
      hide-actions
      :total-items="datosTabla.length"
      :headers="headers"
      :items="datosTabla"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td class="pa-0">
          <v-menu
            ref="menuref"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            lazy
            open-delay="200"
            v-model="props.item.menu"
            :close-on-content-click="false"
          >
            <v-text-field
              slot="activator"
              :value="formatFecha(props.item.fecha)"
              readonly
              full-width
              single-line
              auto-grow
            ></v-text-field>
            <v-date-picker
              v-model="props.item.fecha"
              @change="props.item.menu=false"
              locale="ES-ar"
            >
            </v-date-picker>
          </v-menu>
        </td>
        <td class=pa-0>

          <!-- <v-text-field
              slot="input"
              v-model.lazy="props.item.monto"
              v-money="moneyConfig"
              :readonly="!editable"
              placeholder="Monto"
              hint="Monto"
              full-width
              single-line
              auto-grow
            >
            </v-text-field> -->

          <money
            class="money"
            :readonly="!editable"
            v-model.lazy="props.item.monto"
            v-bind="moneyConfig"
            reverse
            hint="Ingrese Monto"
          ></money>
        </td>
        <td class="pa-0">
          <v-text-field
            slot="input"
            v-model="props.item.proveedor"
            :readonly="!editable"
            :return-value.sync="props.item.proveedor"
            placeholder="Proveedor"
            hint="Provedoor"
            full-width
            single-line
            auto-grow
          >
          </v-text-field>
        </td>
        <td class="pa-0">
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
        <td class="pa-0">
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
        <td class="pa-0">
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
        <td class="pa-0">
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
        <td class="pa-0">
          <v-text-field
            slot="input"
            label="Edit"
            v-model="props.item.comentarios"
            :readonly="!editable"
            :return-value.sync="props.item.comentarios"
            placeholder="Año"
            hint="Año"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td class="pa-0">
          <v-icon
            class="trash"
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
  mounted () {    this.$store.dispatch('cargaDatos')
  },


  data: () => ({
    // date: new Date().toISOString().substr(0, 10),
    menu: false,
    directives: { money: VMoney },
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
    ]
  }),
  computed: {
    datosTabla () { return this.$store.state.datosTabla },
    sumaMontos () {
      return this.$store.state.datosTabla
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
  methods: {
    formatFecha (fecha) {
      return moment(fecha, 'YYYY-MM-DD').format('DD/MM/YYYY')
    },
    deleteItem (item) { this.$store.dispatch('deleteItem', item) },
    nuevo () {
      this.$store.state.datosTabla.push({
        fecha: new Date(),
        monto: '',
        comentarios: '',
        proveedor: '',
        numeroFactura: '',
        concepto: '',
        cuenta: '',
        cuota: '',
        año: ''
      })
    }

  }
}
</script>
<style style scoped>
/* body:not(.user-is-tabbing) button:focus,
body:not(.user-is-tabbing) input:focus,
body:not(.user-is-tabbing) select:focus,
body:not(.user-is-tabbing) textarea:focus {
  outline: none; */
/* } */
input.v-money {
  font-size: 16px;
  text-align: left;
  box-sizing: inherit;
  max-height: 32px;
  text-decoration: inherit;
  font-family: "Roboto", sans-serif;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 8px 0 8px;
  max-width: 100%;
  min-width: 0px;
  width: 100%;
  margin-bottom: 25px;
  outline: none;
}
.money {
  webkit-box-sizing: inherit;
}
.trash {
  padding-bottom: 20px;
}
</style>
