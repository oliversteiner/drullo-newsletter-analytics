import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import store, { SubscriberStore } from '@/store'
import * as api from '@/store/api'
import { Member, Subscriber, SubscriberCountResponse, SubscriberGroup, SubscriberGroupsResponse } from '@/models/models'
import getSubscriberStatus from '@/_helper/subscriberStatus'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ISubscriberModule {
  list: Subscriber[]
  groups: SubscriberGroup[]
  count: number
}

@Module({
  namespaced: true,
  name: 'subscriber',
  store,
})
export default class SubscriberModule extends VuexModule implements ISubscriberModule {
  public list: Subscriber[] = []
  public groups: SubscriberGroup[] = []
  public count: number = 0

  @Action({ commit: 'getSubscriberGroups' })
  async loadSubscriberGroups() {
    return await api.getSubscriberGroups()
  }

  @Mutation
  public async refresh() {
    // ------------------  Subscribers  ------------------

    if (SubscriberStore.count == 0) {
      const listFromServer = await api.getAllSubscribers()
      const members = listFromServer.members

      const subscribers: Subscriber[] = []

      if (members) {
        members.forEach((member: Member) => {
          let duplicate = false
          const subscriber: Subscriber = {
            id: member.id,
            contact: member.contact,
            address: member.address,
            error: false,
            read: false,
            newsletter: member.newsletter,
            groups: member.groups,
            origin: member.origin,
            data: member.data,
            status: getSubscriberStatus(member.data),
          }

          subscriber.createdTs = member.created
          subscriber.changedTs = member.changed
          subscriber.created = new Date(member.created * 1000)
          subscriber.changed = new Date(member.changed * 1000)

          // check on duplicates
          subscribers.forEach((subscriber: Subscriber) => {
            if (subscriber.id == member.id) {
              duplicate = true
            }
          })

          // Add new Subscriber to list
          if (!duplicate) {
            subscribers.push(subscriber)
          }
        })
      }
      this.list = subscribers
      this.count = subscribers.length

      // ------------------  Subscriber Groups  ------------------
      const groupResponse = await api.getSubscriberGroups()
      this.groups = groupResponse.subscriberGroups
    } else {
      true
    }
  }
}
