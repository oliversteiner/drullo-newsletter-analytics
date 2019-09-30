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
          <input
            v-model="fullText"
            type="text"
            @keyup.enter="setFilter('fulltext')"
            placeholder="Suche Name, Adresse"
          />
          <span class="btn btn-icon" @click="setFilter('fulltext')">
            <font-awesome-icon icon="search"></font-awesome-icon>
          </span>
        </div>
        <!-- Number of Subscribers-->
        <div class="toolbar-info">{{ subscribersFiltered.length }} von {{ numberOfAllSubscribers }} Empfänger</div>
      </div>
    </scroll-fixed-header>

    <!-- List -->
    <div class="layout-list-and-sidebar">
      <div class="layout-sidebar" :class="{ open: isSidebarOpen }">
        <scroll-fixed-header :fixed.sync="fixed" :threshold="100" user-class="fixed-sidebar">
          <div class="btn btn-icon" @click="isSidebarOpen = !isSidebarOpen">
            <font-awesome-icon v-show="isSidebarOpen" icon="chevron-left"></font-awesome-icon>
            <font-awesome-icon v-show="!isSidebarOpen" icon="chevron-right"></font-awesome-icon>
          </div>
          <div v-show="isSidebarOpen" class="editor-window">
            <SubscriberEdit :subscriber-id="currentSubscriberID"> </SubscriberEdit>
          </div>
        </scroll-fixed-header>
      </div>

      <div class="layout-list">
        <table class="subscriber-list-table">
          <tr
            v-for="subscriber in subscribersFiltered"
            :key="subscriber.id + '-analytics'"
            class="list-row"
            :class="checkActive(subscriber)"
          >
            <td class="list-item list-item-status">
              <div class=" subscriber-status" :class="subscriber.currentStatus" />
            </td>
            <td v-if="debug" class="list-item list-item-id">{{ subscriber.id }}</td>
            <td class="list-item list-item-first-name" @click="editSubscriber(subscriber)">
              {{ subscriber.personal.firstName }}
            </td>
            <td class="list-item list-item-last-name" @click="editSubscriber(subscriber)">
              {{ subscriber.personal.lastName }}
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
import { Component, Vue } from 'vue-property-decorator'
import { SubscriberStore } from '@/store'
import { Subscriber, SubscriberStatus } from '@/_models/SubscriberClass'
import { EnumsSubscriberStatus } from '@/enums'
import ScrollFixedHeader from '@/components/ScrollFixedHeader/scrollFixedHeader.vue'
import SubscriberEdit from '@/components/SubscriberEdit/SubscriberEdit.vue'
import { SubscriberGroupTerm } from '@/_models/mollo'

@Component({
  components: { ScrollFixedHeader, SubscriberEdit },
})
export default class SubscriberListDynamic extends Vue {
  private debug = true

  private fullSubscriberList: Subscriber[] = []
  private subscribersFiltered: Subscriber[] = []
  private currentSubscriber: Subscriber | null = null
  private currentSubscriberID: number = 0

  private clear = false
  private test = false
  private groups: number[] = []
  private fullText: string = ''
  private status: string[] = []
  private isSidebarOpen = false

  // fixed header
  private fixed = false

  // Subscribers
  private editSubscriber(subscriber: Subscriber) {
    this.isSidebarOpen = true
    this.currentSubscriber = subscriber
    this.currentSubscriberID = subscriber.id
  }

  private toggleTag(subscriber: Subscriber, group: SubscriberGroupTerm) {
    alert('toggleTag')
  }

  checkActive(subscriber: Subscriber) {
    if (this.currentSubscriber && this.currentSubscriber.id == subscriber.id) {
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

    this.subscribersFiltered = subscriberList
  }

  get subscriberList() {
    return this.subscribersFiltered
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
  private filterGroups(groups: SubscriberGroupTerm[]) {
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

    // search in email
    if (subscriber.contact && subscriber.contact.email) {
      const email = subscriber.contact.email
      email.toString().toLowerCase()
      if (email.search(searchtext) != -1) return true
    }

    let result = false
    let searchPlaces = {}
    searchPlaces = Object.assign(searchPlaces, subscriber.personal, subscriber.address)

    Object.entries(searchPlaces).forEach(([key, value]) => {
      // @ts-ignore
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
    this.subscribersFiltered = subList
    // this.currentSubscriber = subList[0]
  }
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>
