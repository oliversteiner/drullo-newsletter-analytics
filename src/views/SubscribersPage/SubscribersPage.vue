<template>
  <div class="subscriber-view">
    <div class="raw-data">
      <div>{{ numberOfSubscribers }} Empfänger</div>


      <!-- List -->
      <subscriberTable :subscriber-list="subscriberList"></subscriberTable>

    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eventBus } from '@/main'
import newsletters from '@/store/modules/NewslettersModule'
import subscribers from '@/store/modules/SubscriberModule'
import SubscriberTable from '@/components/SubscriberTable/SubscriberTable.vue'
import { SubscriberStore } from '@/store'
import { StatusMessage } from '@/models/models'

@Component({
  components: { SubscriberTable },
})
export default class SubscribersPage extends Vue {
  private loading: boolean = true

  get subscriberList() {
    return SubscriberStore.list
  }

  get numberOfSubscribers() {
    return SubscriberStore.count
  }

  async created() {
  }
}
</script>
<style lang="scss" scoped>
@import 'SubscribersPage';
</style>
