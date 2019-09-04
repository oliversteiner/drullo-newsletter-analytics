<template>
  <div class="analytics">
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

    <h1>Analytics</h1>

    <div v-if="!newsletter">
      <div class="loading">
        <div class="loading-icon">
          <font-awesome-icon icon="circle-notch" spin size="lg" />
        </div>
        <div class="loading-text">
          lade Newsletter Daten ...
        </div>
      </div>
    </div>

    <div v-if="newsletter">
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
          <div ref="collapsibles">
            <div class="collapsible">
              <!-- Title -->
              <h2 class="selector-trigger" @click="toggleSelector()">
                <font-awesome-icon v-if="!isOpenSelector" class="title-caret" icon="caret-right"></font-awesome-icon>
                <font-awesome-icon v-if="isOpenSelector" icon="caret-down"></font-awesome-icon>
                <div class="title-text">{{ newsletter.title }}</div>
              </h2>

              <!-- Newletter selector -->
              <div v-show="isOpenSelector" class="selector-wrapper ">
                <NewsletterSelector
                  ref="test-ref"
                  :newsletter-list-send="newsletterListSortedSend.send"
                  :newsletter-list-un-send="newsletterListSortedSend.unSend"
                  :selected-newsletter="newsletterId"
                  @changeNewsletter="changeNewsletter($event)"
                />
              </div>
            </div>
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
              {{ group.name }} ({{ group.subscribers }})
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
      <NewsletterPieChart :data-statistic="statistic"></NewsletterPieChart>

      <!-- timeline -->
      <NewsletterTimeline :subscribers="subscriberList"></NewsletterTimeline>

      <!-- Test  -->
      <!-- <CommitChart></CommitChart>-->

      <!-- Raw Data -->
      <div class="raw-data">
        <!-- Number of Subscibers-->
        <div>{{ subscriberList.length }} von {{ numberOfAllSubscribers }} Empfänger</div>

        <!-- List -->
        <ul class="subscriber-list">
          <li v-for="subscriber in subscriberList" :key="subscriber.id + '-analytics'">
            <div class="subscriber-list-wrapper">
              <div class="subscriber-status" :class="subscriber.currentStatus"></div>
              <div v-if="debug">{{ subscriber.id }} -</div>
              <div>{{ subscriber.contact.email }}</div>
            </div>
          </li>
        </ul>
      </div>

      <RawDataList />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import RawDataList from '@/components/RawDataList/RawDataList.vue'
import newsletters from '@/store/modules/newsletters'
import subscribers from '@/store/modules/subscribers'
import { eventBus } from '@/main'
import { MolloMemberData, Newsletter, Statistic, Subscriber } from '@/models/models'
import hotkeys from 'hotkeys-js'
import { EnumsSubscriberStatus } from '@/enums'
import NewsletterSelector from '@/components/NewsletterSelector/NewsletterSelector.vue'
import NewsletterPieChart from '@/components/NewsletterPieChart/NewsletterPieChart.vue'
import NewsletterTimeline from '@/components/NewsletterTimeline/NewsletterTimeline.vue'

@Component({
  components: { RawDataList, NewsletterTimeline, NewsletterPieChart, NewsletterSelector },
})
export default class Analytics extends Vue {
  private debug = false
  private isOpenSelector: boolean = false
  private loading: boolean = true
  private loadingState: number = 0
  private numberOfAllSubscribers: number = 0
  private newsletterId: number = 0
  private subGroupId: number = 0
  private statistic: Statistic = { send: 0, open: 0, unsubscribe: 0, error: 0 }
  private filterdSubscribers: Subscriber[] = []
  private currentNewsletter!: Newsletter

  changeNewsletter(newsletterId: number) {
    this.newsletterId = newsletterId
    this.currentNewsletter = this.getNewsletterById(newsletterId)
    this.subGroupId = this.getGroupsFromNewsletter()

    // close Selector
    this.isOpenSelector = false
  }

  getNewsletterById(newsletterId: number) {
    return newsletters.list.filter(newsletter => newsletter.id === newsletterId)[0]
  }

  openSelector() {
    this.isOpenSelector = true
  }

  onClose() {
    this.isOpenSelector = false
  }

  toggleSelector() {
    this.isOpenSelector = !this.isOpenSelector
    console.log('toggleSelector', this.isOpenSelector)
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
            //  console.log('isInGroup ' + this.subGroupId)
            isInGroup = true
          }
        })
        return isInGroup
      })

    // set Status based on Message ID
    let filterdSubscribersStatus = filterdSubscribers.map(subscriber => {
      // new default status
      subscriber.currentStatus = EnumsSubscriberStatus.NONE
      // iterate over status
      subscriber.status.forEach(message => {
        if (message.messageId === this.newsletterId) {
          // add status for current Newsletter
          subscriber.currentStatus = message.status
        }
      })
      return subscriber
    })

    //  console.log('filterdSubscribersStatus', filterdSubscribersStatus)

    this.filterdSubscribers = filterdSubscribersStatus
    return filterdSubscribersStatus
  }

  get numberOfSubscribers() {
    return subscribers.count
  }

  get subscriberGroups() {
    if (this.newsletter) return this.newsletter.subscriberGroups
  }
  get statisticData() {
    return this.updateStatistic()
  }

  get newsletter() {
    let currentNewsletter = newsletters.list[0]

    if (this.newsletterId === 0) {
      currentNewsletter = newsletters.list[0]
      // get latest Newsletter who was sended
      const result = newsletters.list.filter(newsletter => newsletter.isSend)
      if (result.length != 0) {
        currentNewsletter = result[0]
      } else {
        console.error('No Newsletter found', this.newsletterId)
      }
    } else {
      const result = newsletters.list.filter(newsletter => newsletter.id === this.newsletterId)
      if (result.length != 0) {
        currentNewsletter = result[0]
      } else {
        console.error('No Newsletter found', this.newsletterId)
      }
    }

    this.currentNewsletter = currentNewsletter
    return currentNewsletter
  }

  changeSubscriberGroup(groupID: number) {
    console.log('changeSubscriberGroup', groupID)
    this.subGroupId = groupID
    this.updateStatistic()
  }

  updateStatistic() {
    let statistic: Statistic = { open: 0, send: 0, unsubscribe: 0, error: 0 }
    const subs = subscribers.list
    // console.log('subs', subs)

    subs.forEach((sub: Subscriber) => {
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

            // error
            if (item.error || item.invalidEmail) {
              statistic.error++
            }
          }
        })
      }
    })
    this.statistic = statistic
    console.log('updateStatistic: ' + this.newsletterId, statistic)
    return statistic
  }

  getGroupsFromNewsletter() {
    if (this.currentNewsletter) return this.currentNewsletter.subscriberGroups[0].id
    return 0
  }

  @Ref('collapsibles') readonly collapsibles!: HTMLElement
  onClickOutside(event: MouseEvent) {
    if (!this.collapsibles || this.collapsibles.contains(event.target as HTMLElement)) {
      console.log('inside')
    } else {
      console.log('outside')
      this.isOpenSelector = false
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
    this.changeNewsletter(newsletterId)
    this.subGroupId = result[0].subscriberGroups[0].id

    // Update Statistic
    this.updateStatistic()
  }

  mounted() {
    // Close Popup if clickt outside of Popup
    document.addEventListener('click', this.onClickOutside)

    // Global press esc
    hotkeys('esc', () => {
      // event.preventDefault()
      console.log('ESC pressed')
      this.isOpenSelector = false
    })
  }

  beforeDestroy() {
    // remove EventListeners
    document.removeEventListener('click', this.onClickOutside)
  }
}
</script>

<style lang="scss" scoped>
@import 'Analytics';
</style>
