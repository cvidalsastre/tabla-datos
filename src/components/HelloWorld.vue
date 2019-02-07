
<template>
  <div>
    <v-toolbar
      flat
      color="white"
    >
      <v-toolbar-title>Tabla Montos</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialogFalse"
        max-width="900px"
      >
        <v-btn
          @click="guardaCambio"
          slot="activator"
          color="primary"
          dark
          class="mb-2"
        >Nuevo</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.fecha"
                    label="Fecha"
                  ></v-text-field>

                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>

        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="datosTabla"
      class="elevation-1"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.fecha"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.fecha }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.fecha"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.monto"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.monto }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.monto"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.proveedor"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.proveedor }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.proveedor"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.numeroFactura"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.numeroFactura }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.numeroFactura"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.concepto"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.concepto }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.concepto"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.cuenta"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.cuenta }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.cuenta"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.año"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.año }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.año"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <!-- desabilitar edicion para usuarios -->
          <v-edit-dialog
            :return-value.sync="props.item.comentarios"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.comentarios }}
            <v-text-field
              v-if="editable"
              slot="input"
              v-model="props.item.comentarios"
              :rules="[max25chars]"
              label="Comentarios"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <!-- <td>{{ props.item.fecha }}</td>
        <td class="text-xs">{{ props.item.monto }}</td>
        <td class="text-xs">{{ props.item.comentarios }}</td>
        <td class="justify-center layout px-0"> -->
        <v-icon
          small
          class="mr-2"
          @click="editItem(props.item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteItem(props.item)"
        >
          delete
        </v-icon>
        <!-- //aca borre un endtag </td> que no se q onda si rompi todo(por ahora funca) -->
      </template>
      <template slot="no-data">
        <v-btn
          color="primary"
          @click="initialize"
        >Reset</v-btn>
      </template>
    </v-data-table>
    <v-snackbar
      v-if="editable"
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}
      <v-btn
        flat
        @click="snack = false"
      >Close</v-btn>
    </v-snackbar>
  </div>

</template>

<script>
// {DATA TABLE adentro de un card y al final que diga la suma de todes les montxs}fecha(fecha) proveedor string numero de factura()numero concepto string , cuenta (string), cuota(numero), año(numero 1 2 3), monto(dinero)
// otra tabla año cuota, fecha, monto(plata), tipo(menu despplegable adicionales(1) reformulacion(2) nada(3))
export default {
  data: () => ({
    snack: false,
    editable: true,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    pagination: {},
    dialog: false,

    headers: [
      { text: 'Fecha', value: 'fecha' },
      { text: 'Monto', value: 'monto', sortable: false },
      { text: 'Proveedor', value: 'proveedor' },
      { text: 'Número de factura', value: 'numeroFactura' },
      { text: 'Concepto', value: 'concepto' },
      { text: 'Cuenta', value: 'cuenta' },
      { text: 'Año', value: 'año' },
      { text: 'Comentarios', value: 'comentarios', sortable: false }

    ],

    datosTabla: [],
    editedIndex: -1,
    editedItem: {
      fecha: '',
      monto: 0,
      comentarios: 0,
      proveedor: '',
      numeroFactura: 0,
      concepto: '',
      cuenta: '',
      cuota: '',
      año: 0

    },
    defaultItem: {
      fecha: '',
      monto: 0,
      comentarios: 0,
      proveedor: '',
      numeroFactura: 0,
      concepto: '',
      cuenta: '',
      cuota: '',
      año: 0
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.datosTabla = [
        {
          fecha: '10-05-2006',
          monto: 159,
          comentarios: 'Ingreso'

        },
        {
          fecha: '01-02-2024',
          monto: 237,
          comentarios: 'Viaticos'

        },
        {
          fecha: '11-08-2015',
          monto: 262,
          comentarios: 'Viáticos'

        },
        {
          fecha: '30-05-2019',
          monto: 305,
          comentarios: 'Bibliografia'

        },
        {
          fecha: '12-05-2019',
          monto: 356,
          comentarios: 'Gastos de administración'

        },
        {
          fecha: '30-06-2020',
          monto: 375,
          comentarios: 'Equipamiento'
        }

      ]
    },
    // funciones del generador de lineas

    deleteItem (item) {
      const index = this.datosTabla.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.datosTabla.splice(index, 1)
    },

    guardaCambio () {
      if (this.editedIndex > -1) {
        Object.assign(this.datosTabla[this.editedIndex], this.defaultItem)
      } else {
        this.datosTabla.push(this.defaultItem)
      }
    },
    // funciones del dialog
    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    }

  }
}
</script>
