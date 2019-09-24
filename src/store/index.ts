import Vue from 'vue'
import Vuex, { Payload } from 'vuex'
import VuexPersistence from 'vuex-persist'
import { getModule } from 'vuex-module-decorators'
import SubscriberModule from '@/store/modules/SubscriberModule'
import TasksModule from '@/store/modules/TasksModule'
import NewslettersModule from '@/store/modules/NewslettersModule'
import { Newsletter } from '@/_models/NewsletterClass'
import { Task, TaskRelated } from '@/_models/TaskClass'
import { Subscriber } from '@/_models/SubscriberClass'
import { SubscriberGroupTerm } from '@/_models/mollo'

Vue.use(Vuex)

interface SubscriberState {
  list: Subscriber[]
  groups: SubscriberGroupTerm[]
  count: number
}

interface TasksState {
  list: Task[]
  relatedList: TaskRelated[]
  count: number
}

interface NewsletterState {
  list: Newsletter[]
  count: number
}

export interface State {
  subscriber: SubscriberState
  tasks: TasksState
  newsletter: NewsletterState
}

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,

  // Function that passes the state and returns the state with only the objects you want to store.
  //  reducer: state => ({
  //  keepThisModule: state.keepThisModule,
  //  keepThisModuleToo: state.keepThisModuleToo,
  // getRidOfThisModule: state.getRidOfThisModule
  // }),
})

const store = new Vuex.Store<State>({
  modules: {
    subscriber: SubscriberModule,
    tasks: TasksModule,
    newsletter: NewslettersModule,
  },
  plugins: [vuexLocal.plugin],
})

export default store
export const SubscriberStore = getModule(SubscriberModule, store)
export const TasksStore = getModule(TasksModule, store)
export const NewsletterStore = getModule(NewslettersModule, store)
