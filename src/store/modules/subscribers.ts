import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import { Member, Subscriber } from '@/store/models'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'subscribers',
  store,
})
class SubscriberModule extends VuexModule {
  subscribersList: Subscriber[] = []
  memberList: Member[] = []

  @MutationAction
  async refreshSubscriberList() {
    const listFromServer = await api.getAllSubscribers()
    const members = listFromServer.members
    const subscribers: Subscriber[] = []

    if (members) {
      members.map(member => {
        const subscriber: Subscriber = {
          id: member.id,
          contact: member.contact,
          address: member.address,
          error: false,
          read: false,
          unsubscribe: false,
          groups: member.subscriber_groups,
          origin: member.origin,
        }

        subscriber.created_ts = member.created
        subscriber.changed_ts = member.changed
        subscriber.created = new Date(member.created * 1000)
        subscriber.changed = new Date(member.changed * 1000)

        // Add new Subscriber to list
        subscribers.push(subscriber)
      })
    }

    return { subscribersList: subscribers }
  }
}

export default getModule(SubscriberModule)
