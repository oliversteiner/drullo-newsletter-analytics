<template>
  <div class="subscriber-view">
    <div class="raw-data">
      <div>{{ numberOfSubscribers }} Empfänger</div>

      <!-- Loading Spinner -->
      <div v-if="loading">
        <font-awesome-icon icon="circle-notch" spin size="lg"></font-awesome-icon>
        Aktualisiere Empfänger ...

        {{ loadingState }} von {{ numberOfAllSubscribers }}
      </div>

      <!-- List -->
      <subscriberTable :subscriber-list="subscriberList"></subscriberTable>

      <!--        <ul>
        <li v-for="subscriber in list">{{ subscriber.id }} - {{ subscriber.contact.email }}</li>
      </ul>-->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eventBus } from '@/main'
import newsletters from '@/store/modules/newsletters'
import subscribers from '@/store/modules/subscribers'
import SubscriberTable from '@/components/SubscriberTable/SubscriberTable.vue'
import { SubscriberStore } from '@/store'

@Component({
  components: { SubscriberTable },
})
export default class SubscribersPage extends Vue {
  private loading: boolean = true
  private loadingState: number = 0
  private numberOfAllSubscribers: number = 0

  get subscriberList() {
    return SubscriberStore.list
  }

  get numberOfSubscribers() {
    return SubscriberStore.count
  }

  async created() {
    eventBus.$on('all Members', (data: number) => {
      this.numberOfAllSubscribers = data
    })
    eventBus.$on('loading Members', (data: number) => {
      this.loadingState = data
      console.log('loading data...', data)
    })

    this.loading = false
  }
}
</script>
<style lang="scss" scoped>
@import 'SubscribersPage';
</style>
