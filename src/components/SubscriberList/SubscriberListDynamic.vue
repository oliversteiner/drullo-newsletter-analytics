<template>
  <div class="subscriber-list-dynamic">
    <scroll-fixed-header :fixed.sync="fixed" :threshold="100" user-class="fixed-table-header">
      <div class="toolbar">
        <div>
          <!-- Filter Test -->
          <button @click="setFilter('test', '')">
            Filtertest
          </button>

          <!-- Status Test -->
          <button @click="setFilter('status', ['open'])">
            Status, send
          </button>

          <!-- Filter Group  -->
          <button @click="setFilter('groups', [22])">
            Filter Group 64, 22
          </button>

          <!-- Clear all filters  -->
          <button @click="setFilter('clear')">
            Clear all Filters
          </button>

          <!-- fulltext  -->
          <input v-model="fullText" type="text" @keyup.enter="setFilter('fulltext')" />
          <button @click="setFilter('fulltext')">
            fulltext
          </button>
        </div>
        <!-- Number of Subscibers-->
        <div class="toolbar-info">{{ subscribersFilterd.length }} von {{ numberOfAllSubscribers }} Empfänger</div>
      </div>
    </scroll-fixed-header>

    <!-- List -->
    <div class="layout-list-and-sidebar">
      <div class="layout-sidebar">
        <scroll-fixed-header :fixed.sync="fixed" :threshold="100" user-class="fixed-sidebar">
          <div class="editor-window">
            <div v-if="currentSubscriber">
              <h2>{{ currentSubscriber.address.first_name }} {{ currentSubscriber.address.last_name }}</h2>
              <div>{{ currentSubscriber.address.street_and_number }}</div>
              <div>{{ currentSubscriber.address.zip_code }} {{ currentSubscriber.address.city }}</div>
            </div>
          </div>
        </scroll-fixed-header>
      </div>

      <div class="layout-list">
        <table class="subscriber-list-table">
          <tr
            v-for="subscriber in subscribersFilterd"
            :key="subscriber.id + '-analytics'"
            class="list-row"
            :class="checkActive(subscriber)"
          >
            <td class="list-item list-item-status">
              <div class=" subscriber-status" :class="subscriber.currentStatus" />
            </td>
            <td v-if="debug" class="list-item list-item-id">{{ subscriber.id }}</td>
            <td class="list-item list-item-first-name" @click="editSubscriber(subscriber)">
              {{ subscriber.address.first_name }}
            </td>
            <td class="list-item list-item-last-name" @click="editSubscriber(subscriber)">
              {{ subscriber.address.last_name }}
            </td>
            <td class="list-item list-item-email" @click="editSubscriber(subscriber)">
              {{ subscriber.contact.email }}
            </td>
            <td class="list-item list-item-groups">
              <ul v-for="group in subscriber.groups" :key="subscriber.id + '-' + group.id">
                <li @click="toggleTag(subscriber, group)">{{ group.name }}</li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SubscriberStore } from '@/store'
import { Subscriber, SubscriberGroup, SubscriberStatus } from '@/_models/SubscriberClass'
import { EnumsSubscriberStatus } from '@/enums'
import ScrollFixedHeader from '@/components/ScrollFixedHeader/scrollFixedHeader.vue'

@Component({
  components: { ScrollFixedHeader },
})
export default class SubscriberListDynamic extends Vue {
  private debug = true

  private fullSubscriberList: Subscriber[] = []
  private subscribersFilterd: Subscriber[] = []
  private currentSubscriber: Subscriber | boolean = false

  private clear = false
  private test = false
  private groups: number[] = []
  private fullText: string = ''
  private status: string[] = []

  // fixed header
  private fixed = false

  // Subscribers
  private editSubscriber(subscriber: Subscriber) {
    this.currentSubscriber = subscriber
  }

  private toggleTag(subscriber: Subscriber, group: SubscriberGroup) {
    alert('toggleTag')
  }

  checkActive(subscriber: Subscriber) {
    if (subscriber.id == this.currentSubscriber.id) {
      return 'active'
    }
  }

  private setFilter(filter: string, items: any) {
    switch (filter) {
      case 'clear':
        this.debug = false
        this.test = false
        this.groups = []
        this.fullText = ''
        this.status = []
        this.clear = true

        break
      case 'test':
        this.test = !this.test
        break
      case 'status':
        this.status = items as string[]
        break
      case 'groups':
        this.groups = items as number[]
        break
      default:
        break
    }
    this.filterResults()
  }

  private filterResults() {
    console.log('filterResults')
    let subscriberList = this.fullSubscriberList

    if (this.test) {
      console.log('-- Filter Test:', this.test)
      subscriberList = subscriberList.filter(subscriber => this.filterTest(subscriber.contact.email))
    }

    if (this.status.length > 0) {
      console.log('-- Filter Status:', this.status)
      subscriberList = subscriberList.filter(subscriber => this.filterStatus(subscriber.status))
    }

    if (this.groups.length > 0) {
      console.log('-- Filter Group:', this.groups)
      subscriberList = subscriberList.filter(subscriber => this.filterGroups(subscriber.groups))
    }

    if (this.fullText != '') {
      console.log('-- Filter fullText:', this.fullText)
      subscriberList = subscriberList.filter(subscriber => this.filterFulltext(subscriber))
    }

    if (this.clear) {
      console.log('--Filter Clear:', this.clear)
      this.clear = false
      subscriberList = this.fullSubscriberList
    }

    this.subscribersFilterd = subscriberList
  }

  get subscriberList() {
    return this.subscribersFilterd
  }

  get numberOfAllSubscribers() {
    return SubscriberStore.count
  }

  // --------- Filters ----------------------

  /**
   *
   * @param email
   */
  private filterTest(email: string) {
    const mailformat = /\S+@\S+\.\S+/
    if (!email.match(mailformat)) return true
  }

  /**
   *
   * @param groups
   */
  private filterGroups(groups: SubscriberGroup[]) {
    const groupIDs = groups.map(group => {
      return group.id
    })

    return this.groups.map(groupId => {
      return groupIDs.includes(groupId)
    })[0]
  }

  /**
   *
   * @param allStatus
   */
  private filterStatus(allStatus: SubscriberStatus[]) {
    const statusIDs = allStatus.map((status: SubscriberStatus) => {
      return status.status
    })

    return this.status.map(statusID => {
      if (statusIDs.includes(statusID as EnumsSubscriberStatus)) {
        return true
      }
    })[0]
  }

  /**
   * Fulltext Filter
   * @param subscriber
   */
  private filterFulltext(subscriber: Subscriber) {
    let searchtext = this.fullText
    searchtext
      .toString()
      .trim()
      .toLowerCase()

    const email = subscriber.contact.email
    email.toString().toLowerCase()
    if (email.search(searchtext) != -1) return true

    let result = false
    Object.entries(subscriber.address).forEach(([key, value]) => {
      const value1 = value.toString().toLowerCase()

      if (value1.search(searchtext) != -1) {
        result = true
      }
    })
    return result
  }

  created() {
    const subList = SubscriberStore.list
    this.fullSubscriberList = subList
    this.subscribersFilterd = subList
  }
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>
