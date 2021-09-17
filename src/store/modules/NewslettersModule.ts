import { getModule, Module, MutationAction, VuexModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import { MolloMessage, Newsletter } from '@/_models/NewsletterClass'

interface NewslettersModuleInterface {
  list: Newsletter[]
  count: number
}

@Module({
  namespaced: true,
  name: 'newsletter',
  store,
})
export default class NewslettersModule extends VuexModule implements NewslettersModuleInterface {
  public list: Newsletter[] = []
  public count: number = 0

  @Mutation
  public async refresh() {
    const listFromServer = await api.getNewsletterList()
    const items = listFromServer.newsletters
    const newsletters: Newsletter[] = []

    if (items) {
      items.map((item: MolloMessage) => {
        const newsletter: Newsletter = {
          id: item.id,
          title: item.title,
          createdTs: item.created,
          changedTs: item.changed,
          sendTs: item.send,
          isSend: item.isSend,
          isTemplate: item.isTemplate,
          text: item.text,
          category: item.category,
          created: new Date(item.created * 1000),
          changed: new Date(item.changed * 1000),
          send: new Date(item.send * 1000),
          subscriberGroups: item.subscriberGroups,
          count: {
            all: 0,
            read: 0,
            send: 0,
            unsubscribe: 0,
          },
        }

        newsletters.push(newsletter)
      })
    } else {
      console.warn('no Newsletters found on Server')
    }
    this.list = newsletters
    this.count = newsletters.length
  }
}
