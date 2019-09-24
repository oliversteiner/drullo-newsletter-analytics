<template>
  <div class="developer-page">
    <h1>Develop</h1>

    <!--  All Subscribers -->
    <SubscriberListDynamic></SubscriberListDynamic>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SubscriberListDynamic from '@/components/SubscriberList/SubscriberListDynamic.vue'

@Component({
  components: { SubscriberListDynamic },
})
export default class DeveloperPage extends Vue {}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
