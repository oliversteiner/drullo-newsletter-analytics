<template>
  <div v-if="newsletter" class="analytics">
    <h1>Analytics</h1>

    <!-- Newsletter Data -->
    <div class="box newsletter-data">
      <!-- Title Wrapper -->
      <div class="selector-background" :class="{ 'selector-active': isOpenSelector }">
        <!-- Title -->
        <h2 class="selector-trigger" @click="toggleSelector()">
          <font-awesome-icon v-if="!isOpenSelector" class="title-caret" icon="caret-right" />
          <font-awesome-icon v-if="isOpenSelector" icon="caret-down" />
          {{ newsletter.title }}
        </h2>

        <!-- Newletter selector -->
        <div v-if="isOpenSelector" class="selector-wrapper">
          <NewsletterSelector
            :newsletter-list="newsletterList"
            :current="selected"
            @changeNewsletter="changeNewsletter($event)"
          />
        </div>
      </div>
      <div class="selector-title-placeholder" :class="{ 'placeholder-active': isOpenSelector }">
        <h2>.</h2>
      </div>

      <!-- Date -->
      <div>
        <span class="label">Versendet am: </span>
        <!-- not send -->
        <div v-if="!newsletter.is_send">
          <span> - </span>
        </div>
        <!-- send -->
        <div v-if="newsletter.is_send">
          <span v-if="newsletter.is_send">{{ newsletter.send | moment('DD.MM.YYYY - HH:mm') }}</span>
          <span v-if="newsletter.is_send">( {{ newsletter.send | moment('calendar') }} )</span>
        </div>
      </div>
    </div>

    <!-- Subscriber Groups -->
    <div class="box box-subscriber-groups">
      <h3>Empfänger Gruppen</h3>
      <nav class="navbar">
        <ul class="navbar nav">
          <li v-for="group in subscriberGroups" :key="group.id" class="nav-item">
            {{ group.name }}
          </li>
        </ul>
      </nav>
    </div>

    <!--  List -->
    <div class="box box-list">
      <table>
        <tr>
          <th>Personen in der Gruppe:</th>
          <td>{{ newsletter.count.all }}</td>
        </tr>
        <tr>
          <th>Versendete Newsletter:</th>
          <td>{{ statistic.send }}</td>
        </tr>
        <tr>
          <th>angesehen:</th>
          <td>{{ statistic.open }}</td>
        </tr>
        <tr>
          <th>Abmeldungen:</th>
          <td>{{ statistic.unsubscribe }}</td>
        </tr>
      </table>
    </div>

    <!-- Pie Chart -->
    <PieChart />

    <!-- timeline -->
    <Timeline />

    <!-- Raw Data -->
    <div class="raw-data">
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading">
        <div class="loading-icon">
          <font-awesome-icon icon="circle-notch" spin size="lg" />
        </div>
        <div class="loading-text">
          aktualisiere Empfängerdaten ...
        </div>

        <div class="loading-count">{{ loadingState }} von {{ numberOfAllSubscribers }}</div>
      </div>

      <!-- Number of Subscibers-->
      <div>{{ numberOfSubscribers }} Empfänger</div>

      <!-- List -->
      <ul>
        <li v-for="subscriber in subscriberList" :key="subscriber.id + '-analytics'">
          {{ subscriber.id }} - {{ subscriber.contact.email }}
        </li>
      </ul>
    </div>

    <RawDataList />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Timeline from '@/components/Timeline/Timeline.vue'
import PieChart from '@/components/PieChart/PieChart.vue'
import RawDataList from '@/components/RawDataList/RawDataList.vue'
import newsletters from '@/store/modules/newsletters'
import NewsletterSelector from '@/components/NewsletterSelector/NewsletterSelector.vue'
import subscribers from '@/store/modules/subscribers'
import { eventBus } from '@/main'
import { Subscriber } from '@/store/models'

@Component({
  components: { RawDataList, Timeline, PieChart, NewsletterSelector },
})
export default class Analytics extends Vue {
  private selected: number = 0
  private isOpenSelector: boolean = false
  private loading: boolean = true
  private loadingState: number = 0
  private numberOfAllSubscribers: number = 0
  private messageID = 0
  private statistic = { send: 0, open: 0, unsubscribe: 0 }

  changeNewsletter(selected: number) {
    console.log('event', selected)
    this.messageID = newsletters.newsletterList[selected].id
    console.log('this.messageID', this.messageID)

    this.selected = selected
    // close Selector
    this.isOpenSelector = false
    this.updateStatistic()
  }

  loadSubscribers() {}

  openSelector() {
    this.isOpenSelector = true
  }

  toggleSelector() {
    this.isOpenSelector = !this.isOpenSelector
  }

  get newsletterList() {
    return newsletters.newsletterList
  }

  get subscriberList() {
    return subscribers.subscriberList
  }

  get numberOfSubscribers() {
    return subscribers.subscriberCount
  }

  get subscriberGroups() {
    return this.newsletter.subscriber_group
  }

  get newsletter() {
    return newsletters.newsletterList[this.selected]
  }

  updateStatistic() {
    this.statistic = { open: 0, send: 0, unsubscribe: 0 }
    const subs = subscribers.subscriberList
    subs.map((sub: Subscriber) => {

      // Message send?
      if (sub.data) {
        console.log('sub.data', sub.data)

        sub.data.map((item: any) => {
          if (item.message_id === this.messageID) {
            // Send
            this.statistic.send++

            // Open
            if (item.open == 1) {
              this.statistic.open++
            }

            // unsubscribe
            if (!sub.newsletter) {
              this.statistic.unsubscribe++
            }
          }
        })
      }
    })
  }

  async created() {
    eventBus.$on('all Members', (data: number) => {
      this.numberOfAllSubscribers = data
    })
    eventBus.$on('loading Members', (data: number) => {
      this.loadingState = data
      console.log('loading data...', data)
    })
    await newsletters.refreshNewsletterList()
    await subscribers.getSubscriberCount()
    await subscribers.refreshSubscriberList()
    this.loading = false
    this.updateStatistic()
    console.log('actual length', subscribers.subscriberList.length)
  }
}
</script>

<style lang="scss" scoped>
@import 'Analytics';
</style>
