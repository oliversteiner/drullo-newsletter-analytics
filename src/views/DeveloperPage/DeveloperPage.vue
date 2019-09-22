<template>
  <div class="developer-page">
    <h1>Develop</h1>

    <!--  All Subscribers -->
    <SubscriberListDynamic></SubscriberListDynamic>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SubscriberStore } from '@/store'
import SubscriberListDynamic from '@/components/SubscriberList/SubscriberListDynamic.vue'

@Component({
  components: { SubscriberListDynamic },
})
export default class DeveloperPage extends Vue {

}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
