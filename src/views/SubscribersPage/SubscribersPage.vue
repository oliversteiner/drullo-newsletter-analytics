<template>
  <div class="subscriber-view">
    <!--  All Subscribers -->
    <SubscriberListDynamic></SubscriberListDynamic>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SubscriberListDynamic from '@/components/SubscriberList/SubscriberListDynamic.vue'

@Component({
  components: { SubscriberListDynamic },
})
export default class SubscribersPage extends Vue {
  created() {}
}
</script>
<style lang="scss" scoped>
@import 'SubscribersPage';
</style>
