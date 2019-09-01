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
  public list: Subscriber[] = []
  public subscriberCount: number = 0

  @MutationAction
  async getSubscriberCount() {
    const all = await api.getSubscriberCount()
  //  this.subscriberCount = all
    return all
  }

  @MutationAction
  async refreshSubscriberList() {
    this.list = []
    const listFromServer = await api.getAllSubscribers()
    const members = listFromServer.members
    console.log('members', members)

    const subscribers: Subscriber[] = []
    let duplicatesCount = 0

    if (members) {
      members.map((member: Member) => {
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
        }

        subscriber.createdTs = member.created
        subscriber.changedTs = member.changed
        subscriber.created = new Date(member.created * 1000)
        subscriber.changed = new Date(member.changed * 1000)

        // Add new Subscriber to list

        // check on duplicates
        subscribers.map((subscriber: Subscriber) => {
          if (subscriber.id == member.id) {
            console.log('------ duplicate ------', member.id)
            //  console.log('--Member:', member);
            //  console.log('--Subscriber:', subscriber);

            duplicate = true
            duplicatesCount++
          }
        })

        if (!duplicate) {
          subscribers.push(subscriber)
        }
      })
    }
    console.log('Duplicates:', duplicatesCount)
  //  this.list = subscribers
    return { list: subscribers }
  }
}

export default getModule(SubscriberModule)
