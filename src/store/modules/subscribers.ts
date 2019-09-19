import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import store, { SubscriberStore } from '@/store'
import * as api from '@/store/api'
import { AxiosResponse } from 'axios'
import SubscriberClass, { Subscriber, SubscriberGroup } from '@/_models/SubscriberClass'

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
  public async loadSubscriberGroups() {
    return await api.getSubscriberGroups()
  }

  // @ts-ignore
  @MutationAction
  public async updateFromServer(): Promise<AxiosResponse> {
    return await api.getUpdatedSubscribers()
  }

  @Mutation
  public async refresh(): Promise<void> {
    // ------------------  Subscribers  ------------------

    const update = await api.getUpdatedSubscribers()

    console.log('Subscriber Changes From Server:', update.data.count)
    console.log('Subscribers in LocalStore:', SubscriberStore.count)

    if (SubscriberStore.count == 0 || update.data.count > 0) {
      const listFromServer = await api.getAllSubscribers()

      const members = listFromServer.members

      const subscribers = SubscriberClass.convertMemberToSubscribers(members)
      this.list = subscribers
      this.count = subscribers.length

      // ------------------  Subscriber Groups  ------------------
      const groupResponse = await api.getSubscriberGroups()
      this.groups = groupResponse.subscriberGroups
    }
  }
}
