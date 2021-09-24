<template>
  <div class="developer-page">
    <h1>Develop</h1>
    <p>{{ $t('message') }}</p>
    <p>Host: {{ HostName }}</p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class DeveloperPage extends Vue {
  get HostName() {
    return process.env.VUE_APP_HOST
  }
}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
