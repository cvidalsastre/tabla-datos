<template>
  <div>
    <v-currency-field
      label="Value"
      v-bind="currency_config"
      :error-messages="errors.price"
      v-model="price"
    ></v-currency-field>
  </div>
</template>

<script>
export default {
  data () {
    return {
      errors: {},
      price: 123.45,
      currency_config: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: ' #',
        precision: 2,
        masked: false,
        allowBlank: false,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
      }
    }
  }
}
</script>
