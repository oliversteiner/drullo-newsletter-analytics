<template>
  <div class="analytics" v-if="newsletter">
    <h1>Analytics</h1>

    <!-- Newsletter Data -->
    <div class="box newsletter-data">
      <!-- Title Wrapper -->
      <div class="selector-background" v-bind:class="{ 'selector-active': isOpenSelector }">
        <!-- Title -->
        <h2 class="selector-trigger" @click="toggleSelector()">
          <font-awesome-icon class="title-caret" icon="caret-right" v-if="!isOpenSelector"></font-awesome-icon>
          <font-awesome-icon icon="caret-down" v-if="isOpenSelector"></font-awesome-icon>
          {{ newsletter.title }}
        </h2>
        <!-- Newletter selector -->
        <div class="selector-wrapper" v-if="isOpenSelector">
          <NewsletterSelector
            v-bind:newsletter-list="newsletterList"
            v-bind:current="selected"
            v-on:changeNewsletter="changeNewsletter($event)"
          ></NewsletterSelector>
        </div>
      </div>
      <div class="selector-title-placeholder" v-bind:class="{ 'placeholder-active': isOpenSelector }"><h2>.</h2></div>

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
          <li class="nav-item" v-for="group in subscriberGroups">
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
          <td>{{ newsletter.count.send }}</td>
        </tr>
        <tr>
          <th>angesehen:</th>
          <td>{{ newsletter.count.read }}</td>
        </tr>
        <tr>
          <th>Abmeldungen:</th>
          <td>{{ newsletter.count.unsubscribe }}</td>
        </tr>
      </table>
    </div>

    <!-- Pie Chart -->
    <PieChart></PieChart>

    <!-- timeline -->
    <Timeline></Timeline>


    <!-- Raw Data -->
    <div class="raw-data">
      <div>{{ numberOfSubscribers }} Empfänger</div>

      <!-- Loading Spinner -->
      <div v-if="loading">
        <font-awesome-icon icon="circle-notch" spin size="lg"></font-awesome-icon>
        lade daten...

        {{ loadingState }} von {{ numberOfAllSubscribers }}
      </div>

      <!-- List -->
      <ul>
        <li v-for="subscriber in subscriberList">{{ subscriber.id }} - {{ subscriber.contact.email }}</li>
      </ul>
    </div>

    <RawDataList></RawDataList>
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

@Component({
  components: { RawDataList, Timeline, PieChart, NewsletterSelector },
})
export default class Analytics extends Vue {
  private selected: number = 0
  private isOpenSelector: boolean = false
  private loading: boolean = true
  loadingState: number = 0
  numberOfAllSubscribers: number = 0

  changeNewsletter(selected: number) {
    console.log('event', selected)
    this.selected = selected
    // close Selector
    this.isOpenSelector = false
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
    return subscribers.subscribersList
  }

  get numberOfSubscribers() {
    return subscribers.subscribersList.length
  }

  get subscriberGroups() {
    return this.newsletter.subscriber_group
  }



  get newsletter() {
    return newsletters.newsletterList[this.selected]
  }



  async created() {

    eventBus.$on('all Members', (data:number) => {
      this.numberOfAllSubscribers = data
    })
    eventBus.$on('loading Members', (data:number) => {
      this.loadingState = data
      console.log('loading data...', data)
    })

    await newsletters.refreshNewsletterList()
    await subscribers.refreshSubscriberList()

    this.loading = false
  }
}
</script>

<style scoped>
@import '_Analytics.scss';
</style>
