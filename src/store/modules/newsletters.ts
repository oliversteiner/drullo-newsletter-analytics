import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import { MolloMessage, Newsletter } from '@/store/models'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'newsletter',
  store,
})
class NewslettersModule extends VuexModule {
  public list: Newsletter[] = []

  @MutationAction
  async refreshNewsletterList() {
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
      console.warn('no Messages from Server')
    }
    console.log('newsletters', newsletters)

    return { list: newsletters }
  }
}

export default getModule(NewslettersModule)
