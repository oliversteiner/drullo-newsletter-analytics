import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { fetchProfile, fetchUser, loginUser, updateUser, setJWT } from '../api'
import { Profile, User, UserForUpdate, UserSubmit } from '@/_models/models'

@Module({
  namespaced: true,
  name: 'users',
  store,
  dynamic: true,
})
class UsersModule extends VuexModule {
  private user: User | null = null
  private profile: Profile | null = null

  public get username() {
    return (this.user && this.user.username) || null
  }

  // @ts-ignore
  @MutationAction
  async login(userSubmit: UserSubmit) {
    const user = await loginUser(userSubmit)
    setJWT(user.token)
    return { user }
  }

  // @ts-ignore
  @MutationAction
  async loadProfile(username: string) {
    const profile = await fetchProfile(username)
    return { profile }
  }

  // @ts-ignore
  @MutationAction
  async loadUser() {
    const user = await fetchUser()
    return { user }
  }

  // @ts-ignore
  @MutationAction
  async updateSelfProfile(userUpdateFields: UserForUpdate) {
    const user = await updateUser(userUpdateFields)
    return { user }
  }
}

export default getModule(UsersModule)
