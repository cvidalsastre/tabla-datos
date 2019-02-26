
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
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <!-- creo q v model genera los conflictos del text field al hacer click -->
          <v-menu
            ref="menuref"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            open-delay="200"
            v-model="props.item.menu"
            :return-value.sync="props.item.fecha"
          >
            <v-text-field
              slot="activator"
              v-model="props.item.fecha"
              label="Picker in menu"
              prepend-icon="event"
              readonly
            ></v-text-field>
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
              <!-- buscar doc del componente -->
              <v-btn
                flat
                color="primary"
                @click="$refs.menuref.save(props.item.fecha)"
              >OK</v-btn>
            </v-date-picker>
          </v-menu>

        </td>
        <td class="
                text-xs-right">
          <money
            v-autowidth="{maxWidth: '960px', minWidth: '25px', comfortZone: 14}"
            :readonly="!editable"
            v-model="props.item.monto"
            v-bind="moneyConfig"
            reverse
            class="textField"
            full-width
            single-line
            hint="Ingrese Monto"
          ></money>
        </td>
        <td class="text-large-right">
          <v-text-field
            input
            v-model="props.item.proveedor"
            :readonly="!editable"
            :return-value.sync="props.item.proveedor"
            placeholder="Proveedor"
            hint="Provedoor"
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
          <v-textarea
            :value='props.item.comentarios'
            :readonly="!editable"
            :return-value.sync="props.item.comentarios"
            placeholder="Comentarios"
            hint="pone comentario"
            full-width
            single-line
            auto-grow
            class="TextArea"
          >
          </v-textarea>
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

    {{ menu }}
  </div>
</template>
<script>
import Dinero from 'dinero.js'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'

// otra tabla año cuota, fecha, monto(polata), tipo(menu despplegable adicionales(1) reformulacion(2) nada(3))
export default {

  data: () => ({
    date: new Date(),
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
      { text: 'Comentarios', value: 'comentarios', sortable: false }
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
      proveedor: 'isisgeva' }],
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
  }),

  computed: {

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
  mounted () {
    this.beforeSuma()
  },
  props: {
    returnValue: null
  },
  watch: {
    isActive (val) {
      if (val) { this.datosTabla.fecha = this.returnValue } else { this.$emit('update:returnValue', this.datosTabla.fecha) }
    }
  },
  methods: {
    close () {
      this.menu = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    editItem (item) {
      this.editedIndex = this.datosTabla.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
    save (value) {
      this.originalValue = value
      this.isActive = false
    },
    beforeSuma () {
      this.datosTabla.push(...this.datosprecargados)
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
      const index = this.datosTabla.indexOf(item)
      console.log({ index })
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
.textField {
  margin-bottom: 27px;
  color: rgba(0, 0, 0, 0.87);
  overflow: hidden;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  line-height: 18px;
  max-width: 100%;
  font-size: 16px;
  min-height: 32px;
  outline: none;
  padding: 7px 0 8px;
  width: 100%;
  background-color: transparent;
  border-style: none;
  box-sizing: inherit;
  -webkit-appearance: textarea;
  -webkit-rtl-ordering: logical;
  cursor: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  border-width: 1px;
  border-image: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  text-rendering: auto;

  -webkit-writing-mode: horizontal-tb !important;
}

.centered-input input {
  text-align: center;
}
</style>
