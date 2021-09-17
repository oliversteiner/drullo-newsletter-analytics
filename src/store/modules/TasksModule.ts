import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import TaskClass, { Task, TaskRelated } from '@/_models/TaskClass'
import { MolloResponse } from '@/_models/mollo'

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
  public async deleteTask(id: number): Promise<MolloResponse> {
    // check if Subscriber exists
    const _task = this.list.find((task: Task) => task.id === id)
    if (!_task) {
      return { status: false }
    }

    // Delete in Store
    const index = this.list.findIndex(task => task.id === id)
    this.list.splice(index, 1)

    // Delete on Server
    const response = await api.deleteTask(id)

    // Error
    if (response && response.error) {
      console.error('', response.message)
    }
    // OK
    if (response && response.id == id) {
      // Set Status to done
    }

    return response
  }

  @Mutation
  public async refresh() {
    const taskListFromServer = await api.getTaskList()
    const molloTasks = taskListFromServer.tasks

    const taskList = TaskClass.convert(molloTasks)
    const relatedList = TaskClass.related(taskList)

    console.log('Get Tasks from Server', taskList)

    this.count = taskList.length
    this.list = taskList
    this.relatedList = relatedList
  }
}
