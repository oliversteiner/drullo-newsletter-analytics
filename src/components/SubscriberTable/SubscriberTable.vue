<template>
  <div class="subscriber-table"></div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { Subscriber } from '@/_models/SubscriberClass'

  @Component({
  components: {},
})
export default class SubscriberTable extends Vue {
  @Prop() subscriberList!: Subscriber[]
}
</script>
<style scoped>
@import '_SubscriberTable.scss';
</style>
