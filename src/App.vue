<template>
  <v-app>
    <hello-world></hello-world>
    <!-- <Plata>
    </Plata> -->
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Plata from './components/Plata'

export default {
  name: 'App',
  components: {
    HelloWorld
    // Plata
  },
  data () {
    return {

    }
  }
}
</script>
