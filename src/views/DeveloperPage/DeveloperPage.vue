<template>
  <div class="developer-page">
    <h1>Develop</h1>

    <h2>i18n Test</h2>

    <p>{{ $t('message') }}</p>
    <p>Host: {{ getHostName }}</p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class DeveloperPage extends Vue {
  getHostName() {
    return process.env.VUE_APP_HOST
  }
}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
