<template>
  <div class="subscriber-list-dynamic">
    <scroll-fixed-header :fixed.sync="fixed" :threshold="100" user-class="fixed-table-header">
      <div class="toolbar toolbar-main">
        <!-- Number of Subscribers-->
        <div class="toolbar-item toolbar-item-info">
          <div class="toolbar-info">{{ subscribersFiltered.length }} von {{ numberOfAllSubscribers }} Empfänger</div>
        </div>

        <!-- Subsribers with error -->
        <div class="toolbar-item toolbar-item-error">
          <div v-if="countSubscibersWithError > 0" class="btn btn-toolbar btn-warning" @click="setErrorFilter">
            <span class="icon">
              <font-awesome-icon icon="exclamation-triangle" />
            </span>
            <span class="label">
              {{ countSubscibersWithError }}
            </span>
          </div>
        </div>

        <!-- Fulltext Search -->
        <div class="toolbar-item toolbar-item-search">
          <label for="search-box" style="display: none">{{ $t('Fulltext Search') }}</label>
          <input
            id="search-box"
            v-model="fullText"
            type="text"
            size="30"
            :placeholder="$t('find name, address')"
            @keyup.enter="setFilter('fulltext')"
          />
          <span class="btn btn-toolbar" @click="setFilter('fulltext')">
            <font-awesome-icon icon="search" />
          </span>
        </div>

        <!-- Clear all filters  -->
        <div class="toolbar-item toolbar-item-clear">
          <span class="btn btn-toolbar" @click="setFilter('clear')">
            <font-awesome-icon icon="times-circle" />
          </span>
        </div>

        <!-- Options -->
        <div class="toolbar-item toolbar-item-options">
          <!-- Blank-->
          <div class="toolbar-item-option hidden">
            <span class="icon" />
            <span class="label" />
            <span class="batch" />
          </div>

          <!-- Show Grups-->
          <div class="toolbar-item-option btn btn-toolbar" @click="optionsShowGroups()">
            <span class="icon">
              <font-awesome-icon v-show="options.showGroups" icon="toggle-on" />
              <font-awesome-icon v-show="!options.showGroups" icon="toggle-off" />
            </span>
            <span class="label">{{ $t('Show Groups') }}</span>
            <span class="batch" />
          </div>
        </div>
      </div>

      <!-- New Row: Group Filter -->
      <div class="toolbar toolbar-group-filter">
        <div :key="componentKey" class="filter-group">
          <div
            v-for="group in filterGroups"
            :key="'group-filter-' + group.id + group.active"
            class="btn-groups"
            :class="{ active: group.active }"
            @click="toggleGroupFilter(group.id)"
          >
            <div>
              <span class="label">{{ group.name }} </span>
              <span class="batch">{{ group.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </scroll-fixed-header>

    <!-- List -->
    <div class="layout-list-and-sidebar">
      <div class="layout-sidebar" :class="{ open: isSidebarOpen }">
        <scroll-fixed-header :fixed.sync="fixed" :threshold="100" user-class="fixed-sidebar">
          <div class="btn btn-icon" @click="isSidebarOpen = !isSidebarOpen">
            <font-awesome-icon v-show="isSidebarOpen" icon="chevron-left" />
            <font-awesome-icon v-show="!isSidebarOpen" icon="chevron-right" />
          </div>
          <div v-show="isSidebarOpen" class="editor-window">
            <SubscriberEdit :subscriber-id="currentSubscriberID" />
          </div>
        </scroll-fixed-header>
      </div>

      <div class="layout-list">
        <table class="subscriber-list-table">
          <!-- Header -->
          <thead>
            <tr>
              <th>
                <!-- Status -->
                <div class="sort-trigger" @click="sortTable('currentStatus')">
                  <div v-if="sortColumn === 'currentStatus'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    O
                  </div>
                </div>
              </th>

              <!-- ID -->
              <th>
                <div class="sort-trigger" @click="sortTable('id')">
                  <div v-if="sortColumn === 'id'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    {{ $t('ID') }}
                  </div>
                </div>
              </th>

              <!-- Changed -->
              <th v-if="showColumnChanged">
                <div class="sort-trigger" @click="sortTable('changed')">
                  <div v-if="sortColumn === 'changed'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    {{ $t('Changed') }}
                  </div>
                </div>
              </th>

              <!-- Firstname -->
              <th>
                <div class="sort-trigger" @click="sortTable('firstName')">
                  <div v-if="sortColumn === 'firstName'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    {{ $t('First Name') }}
                  </div>
                </div>
              </th>

              <!-- Last Name -->
              <th>
                <div class="sort-trigger" @click="sortTable('lastName')">
                  <div v-if="sortColumn === 'lastName'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    {{ $t('Last Name') }}
                  </div>
                </div>
              </th>

              <!-- Email -->
              <th>
                <div class="sort-trigger" @click="sortTable('email')">
                  <div v-if="sortColumn === 'email'" class="icon">
                    <font-awesome-icon v-if="order === 'asc'" icon="caret-up" />
                    <font-awesome-icon v-if="order === 'desc'" icon="caret-down" />
                  </div>
                  <div class="label">
                    {{ $t('Email') }}
                  </div>
                </div>
              </th>
              <th>{{ $t('Groups') }}</th>

              <th v-if="showColumnError">Error</th>
              <th v-if="showColumnStatus">Status</th>
              <th v-if="showColumnCurrentStatus">Current Status</th>
            </tr>
          </thead>

          <!-- Content -->
          <tbody>
            <tr
              v-for="subscriber in subscribersFiltered"
              :key="subscriber.id + '-analytics'"
              class="list-row"
              :class="checkActive(subscriber)"
            >
              <!-- Staus -->
              <td class="list-item list-item-status">
                <div class=" subscriber-status" :class="subscriber.currentStatus" />
              </td>

              <!-- ID -->
              <td v-if="debug" class="list-item list-item-id">
                {{ subscriber.id }}
              </td>

              <!-- Changed -->
              <td v-if="showColumnChanged" class="list-item list-item-changed">
                {{ subscriber.changed | moment('D. M. YYYY') }}
              </td>

              <!-- First Name -->
              <td class="list-item list-item-first-name" @click="editSubscriber(subscriber)">
                {{ subscriber.personal.firstName }}
              </td>

              <!-- Last Name -->
              <td class="list-item list-item-last-name" @click="editSubscriber(subscriber)">
                {{ subscriber.personal.lastName }}
              </td>

              <!-- Email-->
              <td
                class="list-item list-item-email"
                :class="{ error: subscriber.error }"
                @click="editSubscriber(subscriber)"
              >
                {{ subscriber.contact.email }}
              </td>

              <!-- Subscriber Groups -->
              <td v-if="!options.showGroups" class="list-item list-item-groups">
                <div class="subscriber-groups">
                  <div v-for="group in subscriber.groups" :key="group.id" class="subscriber-groups-item">
                    <span class="">{{ group.name }}</span>
                  </div>
                </div>
              </td>

              <!-- Subscriber Groups -->
              <td v-if="options.showGroups" class="list-item list-item-groups">
                <div class="subscriber-groups">
                  <div
                    v-for="group in filterGroups"
                    :key="group.id"
                    :class="{ active: isGroupActive(subscriber, group.id) }"
                    class="subscriber-groups-item"
                    @click="toggleGroup(subscriber, group.id)"
                  >
                    <span class="">{{ group.name }}</span>
                  </div>
                </div>
              </td>

              <!-- Error -->
              <td v-if="showColumnError" class="list-item list-item-error">
                {{ subscriber.error }}
              </td>

              <!-- Status -->
              <td v-if="showColumnStatus" class="list-item list-item-status">
                {{ subscriber.status }}
              </td>

              <!-- CurrentStatus  -->
              <td v-if="showColumnCurrentStatus" class="list-item list-item-currentStatus">
                {{ subscriber.currentStatus }}
              </td>
            </tr>
          </tbody>

          <!-- table footer-->
          <tfoot />
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
import { SubscriberGroupTerm } from '@/store/modules/SubscriberModule'

@Component({
  components: { ScrollFixedHeader, SubscriberEdit },
})
export default class SubscriberListDynamic extends Vue {
  private debug = true
  private componentKey = 0

  // Show Columns
  private showColumnError = false
  private showColumnStatus = false
  private showColumnCurrentStatus = false
  private showColumnChanged = true

  // Sort
  private order = 'asc'
  private sortColumn = ''

  private fullSubscriberList: Subscriber[] = []
  private subscribersFiltered: Subscriber[] = []
  private currentSubscriber: Subscriber | null = null
  private currentSubscriberID: number = 0
  private filterGroups: SubscriberGroupTerm[] = SubscriberStore.groups

  private clear = false
  private test = false
  private groups: number[] = []
  private fullText: string = ''
  private status: string[] = []
  private isSidebarOpen = false
  private options = {
    showGroups: false,
  }

  // fixed header
  private fixed = false

  // Subscribers
  private editSubscriber(subscriber: Subscriber) {
    this.isSidebarOpen = true
    this.currentSubscriber = subscriber
    if (subscriber && subscriber.id) {
      this.currentSubscriberID = subscriber.id
    }
  }

  private checkActive(subscriber: Subscriber) {
    if (this.currentSubscriber && this.currentSubscriber.id == subscriber.id) {
      return 'active'
    }
  }

  // Sort
  sortTable(column: string) {
    // reverse sort direction
    if (column === this.sortColumn) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.order = 'asc'
    }
    this.sortColumn = column
    console.log('sortASC:', this.order)
    console.log('Sort Table with: ', this.sortColumn)

    this.sortTableAction()
  }

  private sortTableAction() {
    let listSorted: Subscriber[] = []
    const column = this.sortColumn
    const order = this.order
    console.log('Sort Table with: ', column)

    const list = this.subscribersFiltered

    // Flatten Array
    list.forEach(sub => {
      if (sub.personal && sub.personal.firstName) {
        sub.firstName = sub.personal.firstName
      }
      if (sub.personal && sub.personal.lastName) {
        sub.lastName = sub.personal.lastName
      }
      if (sub.contact && sub.contact.email) {
        sub.email = sub.contact.email
      }
    })

    listSorted = list.sort(this.compareValues(column, order))

    this.subscribersFiltered = listSorted
  }

  private compareValues(key: any, order = 'asc') {
    return function(a: any, b: any) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

      let comparison = 0
      if (varA > varB) {
        comparison = 1
      } else if (varA < varB) {
        comparison = -1
      }
      return order == 'desc' ? comparison * -1 : comparison
    }
  }

  isGroupActive(subscriber: Subscriber, id: number) {
    if (subscriber) {
      const result = subscriber.groups.filter(_group => _group.id === id)
      if (result.length === 1) {
        return true
      }
    }
    return false
  }

  toggleGroup(subscriber: Subscriber, id: number) {
    if (this.isGroupActive(subscriber, id)) {
      this.removeGroup(subscriber, id)
    } else {
      this.addGroup(subscriber, id)
    }
  }

  addGroup(subscriber: Subscriber, id: number) {
    if (subscriber) {
      const term: SubscriberGroupTerm = SubscriberStore.groups.filter(_group => _group.id === id)[0]
      subscriber.groups.push(term)
    }
  }

  removeGroup(subscriber: Subscriber, id: number) {
    if (subscriber) {
      subscriber.groups = subscriber.groups.filter(_group => _group.id != id)
    }
  }

  // Options
  optionsShowGroups() {
    this.options.showGroups = !this.options.showGroups
  }

  // Filter
  private setFilter(filter: string, items: any | undefined = []) {
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
      subscriberList = subscriberList.filter(subscriber => this.filterGroupsAction(subscriber.groups))
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

  setErrorFilter() {
    this.subscribersFiltered = this.fullSubscriberList.filter(subscriber => subscriber.error === true)
  }

  get subscriberList() {
    return this.subscribersFiltered
  }

  get countSubscibersWithError() {
    const subscriberList = this.fullSubscriberList.filter(subscriber => subscriber.error === true)
    return subscriberList.length
  }

  get numberOfAllSubscribers() {
    return SubscriberStore.count
  }

  get subscriberGroups() {
    return this.filterGroups
  }

  // --------- Filters ----------------------

  /**
   *
   * @param groups
   */
  private filterGroupsAction(groups: SubscriberGroupTerm[]) {
    const groupIDs = groups.map(group => {
      return group.id
    })

    return this.groups.map(groupId => {
      return groupIDs.includes(groupId)
    })[0]
  }

  private toggleGroupFilter(id: number) {
    const ids: number[] = []
    this.filterGroups.forEach(group => {
      if (group.id === id) {
        group.active = !group.active
      }

      if (group.active === true) {
        ids.push(group.id)
      }
    })

    this.forceRerender()
    this.setFilter('groups', ids)
  }

  isGroupFilterActive(id: number) {
    return this.filterGroups.map(group => {
      if (group.id == id) {
        if (group.active) {
          return true
        }
      }
    })
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

  private forceRerender() {
    this.componentKey += 1
  }

  mounted() {
    this.filterGroups = SubscriberStore.groups
  }

  created() {
    const subList = SubscriberStore.list
    this.fullSubscriberList = subList
    this.subscribersFiltered = subList
    this.filterGroups = SubscriberStore.groups
  }
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>
