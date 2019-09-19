import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import 'moment/locale/de-ch'
import TaskClass, { Task, TaskRelated } from '@/_models/TaskClass'

export interface TaskModuleInterface {
  list: Task[]
  relatedList: TaskRelated[]
  count: number
}

@Module({
  namespaced: true,
  name: 'tasks',
  store,
})
export default class TasksModule extends VuexModule implements TaskModuleInterface {
  public list: Task[] = []
  public relatedList: TaskRelated[] = []
  public count = 0

  @Mutation
  public async refresh() {
    const taskListFromServer = await api.getTaskList()
    const molloTasks = taskListFromServer.tasks


    const taskList = TaskClass.convert(molloTasks)
    const relatedList = TaskClass.related(taskList)

    this.count = taskList.length
    this.list = taskList
    this.relatedList = relatedList
  }
}
