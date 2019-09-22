<template>
  <div class="subscriber-list-dynamic">
    <!-- Number of Subscibers-->
    <div>{{ subsribersfilterd.length }} von {{ numberOfAllSubscribers }} Empfänger</div>

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
      <button @click="setFilter('fulltext', 'anton')">
        fulltext
      </button>
    </div>

    <!-- Number of Subscibers-->
    <div>{{ subsribersfilterd.length }} von {{ numberOfAllSubscribers }} Empfänger</div>

    <!-- List -->
    <ul class="subscriber-list">
      <li v-for="subscriber in subsribersfilterd" :key="subscriber.id + '-analytics'">
        <div class="subscriber-list-wrapper">
          <div class="subscriber-status" :class="subscriber.currentStatus" />
          <div v-if="debug">{{ subscriber.id }} -</div>
          <div>{{ subscriber.contact.email }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SubscriberStore } from '@/store'
import { Subscriber, SubscriberGroup, SubscriberStatus } from '@/_models/SubscriberClass'
import { EnumsSubscriberStatus } from '@/enums'

@Component
export default class SubscriberListDynamic extends Vue {
  private fullSubscriberList: Subscriber[] = []
  private subsribersfilterd: Subscriber[] = []

  private clear = false
  private debug = false
  private test = false
  private groups: number[] = []
  private fullText: string = ''
  private status: string[] = []

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
      case 'fulltext':
        this.fullText = items as string
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

    this.subsribersfilterd = subscriberList
  }

  get subscriberList() {
    return this.subsribersfilterd
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
        console.warn('Treffer:', key + ' - ' + value)
        result = true
      }
    })
    console.log(result)
    return result
  }

  created() {
    const subList = SubscriberStore.list
    this.fullSubscriberList = subList
    this.subsribersfilterd = subList
  }
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>
