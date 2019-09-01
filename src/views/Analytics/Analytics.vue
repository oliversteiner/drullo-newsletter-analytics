<template>
  <div v-if="newsletter" class="analytics">
    <h1>Analytics</h1>

    <!-- Newsletter Data -->
    <div class="box newsletter-data">
      <!-- Date -->
      <div>
        <span class="label">Versendet am: </span>
        <!-- not send -->
        <div v-if="!newsletter.isSend">
          <span> - </span>
        </div>
        <!-- send -->
        <div v-if="newsletter.isSend">
          <span v-if="newsletter.isSend">{{ newsletter.send | moment('DD. MMMM - HH:mm') }}</span>
        </div>
      </div>

      <!-- Title Wrapper -->
      <div class="selector-background" :class="{ 'selector-active': isOpenSelector }">
        <!-- Title -->
        <h2 class="selector-trigger" @click="toggleSelector()">
          <font-awesome-icon v-if="!isOpenSelector" class="title-caret" icon="caret-right"></font-awesome-icon>
          <font-awesome-icon v-if="isOpenSelector" icon="caret-down"></font-awesome-icon>
          <div class="title-text">{{ newsletter.title }}</div>
        </h2>

        <!-- Newletter selector -->
        <div v-if="isOpenSelector" class="selector-wrapper">
          <NewsletterSelector
            :newsletter-list-send="newsletterListSortedSend.send"
            :newsletter-list-un-send="newsletterListSortedSend.unSend"
            :selected-newsletter="newsletterId"
            @changeNewsletter="changeNewsletter($event)"
          />
        </div>
      </div>
      <div class="selector-title-placeholder" :class="{ 'placeholder-active': isOpenSelector }">
        <h2>.</h2>
      </div>
    </div>

    <!-- Subscriber Groups -->
    <div class="box box-subscriber-groups">
      <h3>Empfänger Gruppen</h3>
      <nav class="navbar">
        <ul class="navbar nav">
          <li
            v-for="group in subscriberGroups"
            :key="group.id"
            class="nav-item btn btn-outline"
            @click="changeSubscriberGroup(group.id)"
          >
            {{ group.name }}
          </li>
        </ul>
      </nav>
    </div>

    <!--  List -->
    <div class="box box-list">
      <table>
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import Timeline from '@/components/Timeline/Timeline.vue'
import PieChart from '@/components/PieChart/PieChart.vue'
import RawDataList from '@/components/RawDataList/RawDataList.vue'
import newsletters from '@/store/modules/newsletters'
import NewsletterSelector from '@/components/NewsletterSelector/NewsletterSelector.vue'
import subscribers from '@/store/modules/subscribers'
import { eventBus } from '@/main'
import { MolloMemberData, Newsletter, Subscriber } from '@/store/models'

@Component({
  components: { RawDataList, Timeline, PieChart, NewsletterSelector },
})
export default class Analytics extends Vue {
  private isOpenSelector: boolean = false
  private loading: boolean = true
  private loadingState: number = 0
  private numberOfAllSubscribers: number = 0
  private newsletterId: number = 0
  private subGroupId: number = 0
  private statistic = {}
  private filterdSubscribers: Subscriber[] = []
  private currentNewsletter!: Newsletter

  changeNewsletter(newsletterId: number) {
    console.log('event', newsletterId)
    this.newsletterId = newsletterId
    this.subGroupId = this.getGroupsfromNewsletter()
    console.log('this.newsletterId', this.newsletterId)

    // close Selector
    this.isOpenSelector = false
  }

  openSelector() {
    this.isOpenSelector = true
  }

  toggleSelector() {
    this.isOpenSelector = !this.isOpenSelector
  }

  get newsletterList() {
    return newsletters.list
  }

  get newsletterListSortedSend() {
    let send: Newsletter[] = []
    let unSend: Newsletter[] = []

    const items = newsletters.list
    items.map((item: Newsletter) => {
      if (item.isSend) {
        send.push(item)
      } else {
        unSend.push(item)
      }
    })
    return { send: send, unSend: unSend }
  }

  get subscriberList() {
    // console.log('newSubscribers', subscribers.list)

    const filterdSubscribers = subscribers.list
      .filter(sub => sub.groups.length > 0)
      .filter(sub => {
        let isInGroup = false
        sub.groups.map(group => {
          if (group.id == this.subGroupId) {
            console.log('isInGroup ' + this.subGroupId)
            isInGroup = true
          }
        })
        return isInGroup
      })

    this.filterdSubscribers = filterdSubscribers
    return filterdSubscribers
  }

  get numberOfSubscribers() {
    return subscribers.count
  }

  get subscriberGroups() {
    if (this.newsletter) return this.newsletter.subscriberGroups
  }

  get newsletter() {
    let currentNewsletter: Newsletter | boolean

    if (this.newsletterId === 0) {
      currentNewsletter = newsletters.list[0]
      // get latest Newsletter who was sended
      const result = newsletters.list.filter(newsletter => newsletter.isSend)
      if (result.length != 0) {
        console.log('getNewsletter', result)
        currentNewsletter = result[0]
      } else {
        console.error('No Newsletter found', this.newsletterId)
        currentNewsletter = false
      }

      console.log('defaultNewsletter', currentNewsletter)
    } else {
      const result = newsletters.list.filter(newsletter => newsletter.id === this.newsletterId)
      if (result.length != 0) {
        console.log('getNewsletter', result)
        currentNewsletter = result[0]
      } else {
        console.error('No Newsletter found', this.newsletterId)
        currentNewsletter = false
      }
    }
    return currentNewsletter
  }

  changeSubscriberGroup(groupID: number) {
    console.log('changeSubscriberGroup', groupID)
    this.subGroupId = groupID
    this.updateStatistic()
  }

  get statistic1() {
    console.log('--this.newsletterId', this.newsletterId)

    let statistic = { open: 0, send: 0, unsubscribe: 0 }
    const subs = subscribers.list
    subs.map((sub: Subscriber) => {
      // MolloMessages send?

      if (sub.data) {
        sub.data.forEach((item: MolloMemberData) => {
          if (item && item.messageId && item.messageId === this.newsletterId) {
            console.log('item', item)

            // Send
            if (item.sendDate) {
              statistic.send++
            }
            // Open
            if (item.open) {
              statistic.open++
            }

            // unsubscribe
            if (item.unsubscribe) {
              statistic.unsubscribe++
            }
          }
        })
      }
    })
    return statistic
  }

  updateStatistic() {
    console.log('updateStatistic', this.newsletterId)

    let statistic = { open: 0, send: 0, unsubscribe: 0 }
    const subs = subscribers.list
    console.log('subs', subs)

    subs.map((sub: Subscriber) => {
      // MolloMessages send?

      if (sub.data) {
        sub.data.forEach((item: MolloMemberData) => {
          if (item && item.messageId && item.messageId === this.newsletterId) {
            // console.log('sub', sub)
            // Send
            statistic.send++

            // Open
            if (item.open) {
              statistic.open++
            }

            // unsubscribe
            if (item.unsubscribe) {
              statistic.unsubscribe++
            }
          }
        })
      }
    })
    this.statistic = statistic
    console.log('statistic', statistic)
  }

  getGroupsfromNewsletter() {
    if (this.newsletter) {
      const result = this.newsletter
      return result.subscriberGroups[0].id
    } else {
      return 0
    }
  }

  @Watch('subGroupId')
  testFunc() {
    this.updateStatistic()
  }

  async created() {
    eventBus.$on('all Members', (data: number) => {
      this.numberOfAllSubscribers = data
    })
    eventBus.$on('loading Members', (data: number) => {
      this.loadingState = data
      // console.log('loading data...', data)
    })
    // Newsletter
    await newsletters.refreshNewsletterList()

    // Subscribers
    await subscribers.loadSubscriberCount()
    await subscribers.refreshSubscriberList()
    await subscribers.loadSubscriberGroups()
    this.loading = false

    // get newsletter
    const result = newsletters.list.filter(newsletter => newsletter.isSend)
    const newsletterId = result[0].id
    this.currentNewsletter = result[0]
    this.changeNewsletter(newsletterId)
    this.newsletterId = newsletterId
    this.subGroupId = result[0].subscriberGroups[0].id
  }
}
</script>

<style lang="scss" scoped>
@import 'Analytics';
</style>
