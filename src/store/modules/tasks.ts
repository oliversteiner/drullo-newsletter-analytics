import { Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import { Task, TaskRelated } from '@/models/models'
import moment from 'moment'
import 'moment/locale/de-ch'
import { TaskStatus, TaskStatusMessage } from '@/enums'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ITaskModule {
  list: Task[]
  relatedList: TaskRelated[]
  count: number
}

@Module({
  namespaced: true,
  name: 'tasks',
  store,
})
export default class TasksModule extends VuexModule implements ITaskModule {
  public list: Task[] = []
  public relatedList: TaskRelated[] = []
  public count = 0

  @Mutation
  public async refresh() {
    const taskListFromServer = await api.getTaskList()
    const tasks = taskListFromServer.tasks

    // Compute Status

    let relatedList: TaskRelated[] = []

    if (tasks) {
      let counterUndoneTasks = 0

      tasks.map(task => {
        // Working
        task.working = false

        // Date
        task.createdMoment = moment.unix(task.created)
        task.changedMoment = moment.unix(task.changed)
        task.runMoment = moment.unix(task.changed)

        // if Task is undone change runMoment to next possible Time
        if (!task.done) {
          moment.locale('de')

          // next full hour and 5 minutes (14:05)
          const now = new Date()
          const p = 60 * 60 * 1000 // milliseconds in an hour
          const fullHour = new Date(Math.ceil(now.getTime() / p) * p)
          let nextRunAt = moment(fullHour).add(counterUndoneTasks - 1, 'hour')
          nextRunAt = nextRunAt.clone().minute(5)

          task.runMoment = nextRunAt

          // count unfinished tasks for increase of the execution hour
          counterUndoneTasks++
        }

        // Status
        task.statusMessage = TaskStatusMessage.DEFAULT
        task.status = TaskStatus.DEFAULT

        // Task is done
        if (task.done) {
          task.status = TaskStatus.DONE
          task.statusMessage = TaskStatusMessage.DONE
        } else {
          // task is waiting to run
          task.status = TaskStatus.WAITING
          task.statusMessage = TaskStatusMessage.WAITING
        }
        if (task.number === 1 && !task.done) {
          task.statusMessage = TaskStatusMessage.SAVE
        }

        // Icon
        switch (task.status) {
          // @ts-ignore
          case TaskStatus.WORKING:
            task.icon = 'cog'
            break
          case TaskStatus.DONE:
            task.icon = 'check'
            break
          // @ts-ignore
          case TaskStatus.WARNING:
            task.icon = 'exclamation-triangle'
            break
          // @ts-ignore
          case TaskStatus.ERROR:
            task.icon = 'uexclamation-circle'
            break
          default:
            task.icon = 'clock'
            break
        }
      })

      let uuids: string[] = []

      // return only first task of each related Task
      tasks.forEach((task: Task) => {
        if (uuids.indexOf(task.related) === -1) {
          uuids.push(task.related)

          if (task.related) {
            const related: TaskRelated = {
              related: task.related,
              message: task.message,
            }
            relatedList.push(related)
          }
        }
      })
    }

    this.count = tasks.length
    this.list = tasks
    this.relatedList = relatedList
  }
}
