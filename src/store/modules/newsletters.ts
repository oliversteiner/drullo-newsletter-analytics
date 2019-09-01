import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import {Newsletter, Subscriber} from '@/store/models'
import { State } from 'vuex-class'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'newsletter',
  store,
})
class NewslettersModule extends VuexModule {
  public newsletterList: Newsletter[] = []

  @MutationAction
  async refreshNewsletterList() {
    const listFromServer = await api.getNewsletterList()
    const items = listFromServer.newsletters
    const newsletters: Newsletter[] = []

    if (items) {
      items.map((item: Newsletter) => {
        const newsletter: Newsletter = item
        newsletter.created = new Date(item.created_ts * 1000)
        newsletter.changed = new Date(item.changed_ts * 1000)
        newsletter.send = new Date(item.send_ts * 1000)

        newsletters.push(newsletter)
      })
    }
    return { newsletterList: newsletters }
  }
}

export default getModule(NewslettersModule)
