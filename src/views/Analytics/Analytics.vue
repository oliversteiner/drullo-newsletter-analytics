<template>
  <div class="analytics">
    <h1>Analytics</h1>

    <div v-if="!newsletter">
      <div class="loading">
        <div class="loading-icon">
          <font-awesome-icon icon="circle-notch" spin size="lg" />
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
              <div v-if="isOpenSelector" class="selector-wrapper ">
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
      <div class="box box-legend">
        <table>
          <tr>
            <td><span class="subscriber-status none "></span></td>
            <td>Empfänger:</td>
            <td>{{ statistic.subscribers }}</td>
          </tr>
          <tr>
            <td><span class="subscriber-status send "></span></td>
            <td>Versendet:</td>
            <td>{{ statistic.send }}</td>
          </tr>
          <tr>
            <td><span class="subscriber-status unconfirmed "></span></td>
            <td>Unbestätigt:</td>
            <td>{{ statistic.send - statistic.open }}</td>
          </tr>
          <tr>
            <td><span class="subscriber-status open "></span></td>
            <td>angesehen:</td>
            <td>{{ statistic.open }}</td>
          </tr>
          <tr>
            <td><span class="subscriber-status unsubscribe "></span></td>
            <td>Abmeldungen:</td>
            <td>{{ statistic.unsubscribe }}</td>
          </tr>
          <tr>
            <td><span class="subscriber-status error "></span></td>
            <td>Fehlerhaft:</td>
            <td>{{ statistic.error }}</td>
          </tr>
        </table>
      </div>

      <!-- Pie Chart -->
      <NewsletterPieChart :data-statistic="statistic"></NewsletterPieChart>

      <!-- timeline -->
      <NewsletterTimeline :subscribers="subscriberList"></NewsletterTimeline>

      <!-- Subscribers with warning -->
      <SubscriberListWarning :subscribers="subscriberList" :all="numberOfAllSubscribers"></SubscriberListWarning>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import hotkeys from 'hotkeys-js'
import { EnumsSubscriberStatus } from '@/enums'
import NewsletterSelector from '@/components/NewsletterSelector/NewsletterSelector.vue'
import NewsletterPieChart from '@/components/NewsletterPieChart/NewsletterPieChart.vue'
import NewsletterTimeline from '@/components/NewsletterTimeline/NewsletterTimeline.vue'
import { NewsletterStore, SubscriberStore } from '@/store'
import { Statistic } from '@/_models/models'
import { Newsletter } from '@/_models/NewsletterClass'
import { Subscriber } from '@/_models/SubscriberClass'
import SubscriberListAll from '@/components/SubscriberList/SubscriberListAll.vue'
import SubscriberListWarning from '@/components/SubscriberList/SubscriberListWarning.vue'
import { MolloMemberTelemetry } from '@/_models/MolloMember'

@Component({
  components: { SubscriberListWarning, SubscriberListAll, NewsletterTimeline, NewsletterPieChart, NewsletterSelector },
})
export default class Analytics extends Vue {
  private isOpenSelector: boolean = false
  private loading: boolean = true
  private loadingState: number = 0
  private newsletterId: number = 0
  private subGroupId: number = 0
  private statistic!: Statistic
  private currentNewsletter!: Newsletter

  changeNewsletter(newsletterId: number) {
    // close Selector
    this.isOpenSelector = false

    // set selected Newsletter
    this.newsletterId = newsletterId
    this.currentNewsletter = this.getNewsletterById(newsletterId)
    this.subGroupId = this.getGroupsFromNewsletter()
  }

  getNewsletterById(newsletterId: number) {
    return NewsletterStore.list.filter(newsletter => newsletter.id === newsletterId)[0]
  }

  openSelector() {
    this.isOpenSelector = true
  }

  onClose() {
    this.isOpenSelector = false
  }

  get numberOfAllSubscribers() {
    return SubscriberStore.count
  }

  toggleSelector() {
    this.isOpenSelector = !this.isOpenSelector
  }

  get newsletterList() {
    return NewsletterStore.list
  }

  get newsletterListSortedSend() {
    let send: Newsletter[] = []
    let unSend: Newsletter[] = []

    const items = NewsletterStore.list
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
    const filterdSubscribers = SubscriberStore.list
      .filter(sub => sub.groups.length > 0)
      .filter(sub => {
        let isInGroup = false
        sub.groups.map(group => {
          if (group.id == this.subGroupId) {
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

    return filterdSubscribersStatus
  }

  get numberOfSubscribers() {
    return SubscriberStore.count
  }

  get subscriberGroups() {
    if (this.newsletter) return this.newsletter.subscriberGroups
  }

  get newsletter() {
    let currentNewsletter = NewsletterStore.list[0]

    if (this.newsletterId === 0) {
      currentNewsletter = NewsletterStore.list[0]
      // get latest Newsletter who was sended
      const result = NewsletterStore.list.filter(newsletter => newsletter.isSend)
      if (result.length != 0) {
        currentNewsletter = result[0]
      } else {
        console.error('No Newsletter found', this.newsletterId)
      }
    } else {
      const result = NewsletterStore.list.filter(newsletter => newsletter.id === this.newsletterId)
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
    this.subGroupId = groupID
    this.updateStatistic()
  }

  updateStatistic() {
    let statistic: Statistic = { subscribers: 0, unconfirmed: 0, open: 0, send: 0, unsubscribe: 0, error: 0 }

    SubscriberStore.list.forEach((subscriber: Subscriber) => {
      // MolloMessages send?

      if (subscriber.telemetry && subscriber.telemetry.length !== 0) {

        subscriber.telemetry.forEach((_telemetry: MolloMemberTelemetry) => {
          if (_telemetry && _telemetry.messageId && _telemetry.messageId === this.newsletterId) {
            // Send
            statistic.subscribers++

            // Send
            if (_telemetry.send) {
              statistic.send++
            }
            // Open
            if (_telemetry.open) {
              statistic.open++
            }

            // unsubscribe
            if (_telemetry.unsubscribe) {
              statistic.unsubscribe++
            }

            // error
            if (_telemetry.error || _telemetry.invalidEmail) {
              statistic.error++
            }
          }
        })
      }
      statistic.unconfirmed = statistic.send - (statistic.open + statistic.unsubscribe + statistic.error)
    })
    this.statistic = statistic
  }

  getGroupsFromNewsletter() {
    if (this.currentNewsletter) return this.currentNewsletter.subscriberGroups[0].id
    return 0
  }

  @Ref('collapsibles') readonly collapsibles!: HTMLElement

  onClickOutside(event: MouseEvent) {
    this.isOpenSelector = false
    if (!this.collapsibles || this.collapsibles.contains(event.target as HTMLElement)) {
      this.isOpenSelector = true
    }
  }

  @Watch('subGroupId')
  subGroupMatch() {
    this.updateStatistic()
  }

  private mounted() {
    // Close Popup if  outside click of Popup
    document.addEventListener('click', this.onClickOutside)

    // Global press esc
    hotkeys('esc', () => {
      this.isOpenSelector = false
    })
  }

  private async created() {
    // Response
    this.loading = false

    // get newsletter
    const result = NewsletterStore.list.filter(newsletter => newsletter.isSend)
    const newsletterId = result[0].id
    this.changeNewsletter(newsletterId)
    this.subGroupId = result[0].subscriberGroups[0].id

    // Update Statistic
    this.updateStatistic()
  }

  private beforeDestroy() {
    // remove EventListeners
    document.removeEventListener('click', this.onClickOutside)
  }
}
</script>

<style lang="scss" scoped>
@import 'Analytics';
</style>
