import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

// SettingsModule
// ---------------------------------------------- //

interface SettingsModuleInterface {
  language: string
}

@Module({
  namespaced: true,
  name: 'settings',
  store,
})
export default class SettingsModule extends VuexModule implements SettingsModuleInterface {
  public language = 'en'

  @Mutation
  changeLanguage(id: string) {
    this.language = id
  }

  @Mutation
  public async refresh() {}
}
