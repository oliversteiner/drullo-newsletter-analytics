<template>
  <div class="developer-page">
    <h1>Develop</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VueJsonPretty from 'vue-json-pretty'

@Component({
  components: { VueJsonPretty },
})
export default class DeveloperPage extends Vue {}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
