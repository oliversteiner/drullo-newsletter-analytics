<template>
  <div class="developer-page">
    <h1>Develop</h1>

    <h2>i18n Test</h2>

    <p>{{ $t('message') }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SubscriberListDynamic from '@/components/SubscriberList/SubscriberListDynamic.vue'

@Component({
  components: { SubscriberListDynamic },
})
export default class DeveloperPage extends Vue {
  create() {}
}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
