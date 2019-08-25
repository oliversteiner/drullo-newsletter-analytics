import {getModule, Module, MutationAction, VuexModule} from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import {Newsletter} from '@/store/models'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'newsletter',
  store,
})
class NewslettersModule extends VuexModule {
  newsletterList: Newsletter[] = []

  @MutationAction
  async refreshNewsletterList() {
    const listFromServer = await api.getNewsletterList()
    const newsletters = listFromServer.newsletters

    if (newsletters) {
      newsletters.map(newsletter => {
      })
    }

    return {newsletterList: newsletters}
  }
}

export default getModule(NewslettersModule)
