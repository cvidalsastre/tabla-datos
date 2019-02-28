<template>
  <v-app>
    <hello-world></hello-world>
  </v-app>
</template>
<script>
import HelloWorld from './components/HelloWorld'
export default {
  name: 'App',

  components: {
    HelloWorld
  },
  data () {
    return {
    }
  }
}
</script>
