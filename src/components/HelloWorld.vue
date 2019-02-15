
<template
>
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
      class="elevation-1"
      hide-actions
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <v-menu
          ref="menu"
          v-model="props.item.menu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="props.item.fecha"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            class="acolor"
            slot="activator"
            prepend-icon="event"
            v-model="props.item.fecha"
            :readonly="!editable"
            :return-value.sync="props.item.fecha"
          >
          </v-text-field>
          <v-date-picker
            v-model="props.item.fecha"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              flat
              color="primary"
              @click="props.item.menu = false"
            >Cancel</v-btn>
            <v-btn
              flat
              color="primary"
              @click="$refs.menu.save(props.item.fecha)"
              :return-value.sync="props.item.fecha"
            >OK</v-btn>
          </v-date-picker>
        </v-menu>
        <td>
          <v-currency-field
            v-bind="currency_config"
            :error-messages="errors.price"
            v-model="props.item.monto"
            :readonly="!editable"
            full-width
            single-line
            reverse
            label="0,00"
            suffix="$"
          ></v-currency-field>
          <!-- <v-text-field
            :readonly="!editable"
            class="acolor"
            v-model="props.item.monto"
            full-width
            single-line
            reverse
            label="0,00"
            suffix="$"
          >
          </v-text-field> -->

        </td>
        <td>
          <v-text-field
            v-model="props.item.proveedor"
            :readonly="!editable"
            :return-value.sync="props.item.proveedor"
            placeholder="DD-MM-AAAA"
            hint="pone fecha"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="props.item.numeroFactura"
            :readonly="!editable"
            :return-value.sync="props.item.numeroFactura"
            placeholder="DD-MM-AAAA"
            hint="pone fecha"
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
            placeholder="DD-MM-AAAA"
            hint="pone fecha"
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
            placeholder="DD-MM-AAAA"
            hint="pone fecha"
            full-width
            single-line
          >
          </v-text-field>
        </td>
        <v-text-field
          v-model="props.item.año"
          :readonly="!editable"
          :return-value.sync="props.item.año"
          placeholder="DD-MM-AAAA"
          hint="Año"
          full-width
          single-line
          type='Date'
        >
        </v-text-field>
        <td>
          <!-- desabilitar edicion para usuarios -->
          <v-textarea
            v-model="props.item.comentarios"
            :readonly="!editable"
            :return-value.sync="props.item.comentarios"
            placeholder=""
            hint="pone comentario"
            full-width
            auto-grow
          >
          </v-textarea>
        </td>

        <v-icon
          v-if="editable"
          mediumm
          @click="deleteItem(props.item)"
          left
        >
          delete
        </v-icon>

      </template>
      <template slot="no-data">
        <v-btn color="primary">Reset</v-btn>
      </template>
    </v-data-table>
    <v-card
      color="#42A5F5"
      flat
    >

      <v-alert
        :value="true"
        type="info"
        color="#b3d4fc"
        class="guita pa-0"
      >
        Total Gastos : {{sumaMontos}}
      </v-alert>
    </v-card>
  </div>
</template>
<script>
import Dinero from 'dinero.js'
// otra tabla año cuota, fecha, monto(polata), tipo(menu despplegable adicionales(1) reformulacion(2) nada(3))
export default {
  data: () => ({
    errors: {},
    price: 123.45,
    currency_config: {
      decimal: ',',
      thousands: '.',
      prefix: '$ ',
      suffix: ' #',
      precision: 2,
      masked: false,
      allowBlank: false,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    },
    menu: false,
    date: new Date().toISOString().substr(0, 10),
    admin: true,
    editable: true,
    pagination: {},
    dialog: false,
    headers: [
      { text: 'Fecha', value: 'fecha' },
      { text: 'Monto', value: 'monto' },
      { text: 'Proveedor', value: 'proveedor' },
      { text: 'Número de factura', value: 'numeroFactura' },
      { text: 'Concepto', value: 'concepto' },
      { text: 'Cuenta', value: 'cuenta' },
      { text: 'Año', value: 'año' },
      { text: 'Comentarios', value: 'comentarios', sortable: false }
    ],
    datosTabla: [{
      fecha: '2006-05-20',
      monto: '',
      comentarios: 'Ingreso'
    },
    {
      fecha: '2024-02-1',
      monto: '10,00',
      comentarios: 'Viaticos'
    }],
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
    sumaMontos () {
      return this.datosTabla
        .map(x => {
          const conCentavos = /\./g.test(x.monto) || /,/g.test(x.monto)
          return conCentavos
            ? Dinero({ amount: Number(x.monto.replace(/\D/g, '')), currency: 'ARS' })
            : Dinero({ amount: Number(`${x.monto}00`), currency: 'ARS' })
          // console.log(conCentavos)
          // const format = x.monto.replace(/\D/g, '')
          // return Dinero({ amount: Number(format), currency: 'ARS' })
        })
        .reduce((x, y) => x.add(y), Dinero({ amount: 0, currency: 'ARS' }, 0))
        .toFormat()
      // .toLocaleString('es-ar', {
      //   style: 'currency',
      //   currency: 'ARS',
      //   minimumFractionDigits: 2
      // })
    }
  },
  methods: {
    queonda (x) {
      console.log(x)
    },
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
    // funciones del generador de lineas
    deleteItem (item) {
      const index = this.datosTabla.indexOf(item, 1)
      confirm('Are you sure you want to delete this item?') && this.datosTabla.splice(index, 1)
    }
    // funciones del dialog
  }

}
</script>
<style scoped>
.guita {
  font-size: 40px;
  color: black;
}
</style>
