<template>
  <div>
    <money
      v-model="price"
      v-bind="money"
    ></money> {{price}}
  </div>
</template>

<script>
import { Money } from 'v-money'

export default {
  components: { Money },

  data () {
    return {
      price: 1200,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '$ ',
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
