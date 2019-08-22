import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import { Task, TaskRelated } from '@/store/models'
import moment from 'moment'
import 'moment/locale/de-ch'
import { TaskStatus, TaskStatusMessage } from '@/enums'
import { Moment } from 'moment'

moment.locale('de')

@Module({
  dynamic: true,
  namespaced: true,
  name: 'tasks',
  store,
})
class TasksModule extends VuexModule {
  taskList: Task[] = []
  relatedList: TaskRelated[] = []

  @MutationAction
  async refreshTasklist() {
    console.log('refreshTasklist')

    const taskListfromServer = await api.getTaskList()

    //  console.log('taskListfromServer', taskListfromServer)
    //  console.log('get from Server:', taskListfromServer.tasks)
    //  console.log('get from Server:', taskListfromServer.tasksCount)

    const tasks = taskListfromServer.tasks

    // Compute Status

    let relatedList: TaskRelated[] = []

    if (tasks) {

      let counterUndoneTasks = 0;

      tasks.map(task => {
        // Date
        task.changedMoment = moment.unix(task.changed)
        task.createdMoment = moment.unix(task.created)
        task.runMoment = moment.unix(task.changed)

        // if undone change
        if (!task.done) {
          moment.locale('de')

          // next full hour and 5 minutes (14:05)
          const now = new Date()
          const p = 60 * 60 * 1000 // milliseconds in an hour
          const fullHour = new Date(Math.ceil(now.getTime() / p) * p)
          let nextRunAt = moment(fullHour).add(counterUndoneTasks -1, 'hour')
          nextRunAt = nextRunAt.clone().minute(5)

          task.runMoment = nextRunAt
          counterUndoneTasks++;
        }

        // Status
        task.statusMessage = TaskStatusMessage.DEFAULT

        if (task.done) {
          task.status = TaskStatus.DONE
          task.statusMessage = TaskStatusMessage.DONE
        } else {
          task.status = TaskStatus.WAITING
          task.statusMessage = TaskStatusMessage.WAITING
        }
      })

      let uuid: string[] = []

      // return only first task of each related Task
      tasks.forEach(task => {
        if (-1 === uuid.indexOf(task.related)) {
          uuid.push(task.related)

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

    console.log('relatedList', relatedList)

    //

    return {
      relatedList: relatedList,
      taskList: tasks,
    }
  }
}

export default getModule(TasksModule)
