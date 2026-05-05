<template>
  <our-Printing></our-Printing>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import OurPrinting from './ourPrinting.vue'

@Component({
  components: {
    OurPrinting
  }
})
export default class OurDashboard extends Vue {
}
</script>

<style scoped>
</style>