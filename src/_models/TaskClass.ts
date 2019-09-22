import moment, { Moment } from 'moment'
import { TaskStatus, TaskStatusMessage } from '@/enums'
import { Subscribers } from '@/_models/SubscriberClass'
import { Range } from '@/_models/models'
import { Message } from '@/_models/MessageClass'
import { NewsletterStore } from '@/store'
import { Newsletter } from '@/_models/NewsletterClass'

export interface TasksResponse {
  tasks: (Task)[]
  tasksCount: number
}

export interface TaskRelated {
  related: string
  message: Message
}

export interface Task {
  id: number
  title: string
  created: number
  createdMoment: Moment
  changed: number
  changedMoment: Moment
  runMoment: Moment | number
  done: boolean
  working: false
  status: TaskStatus
  statusMessage: TaskStatusMessage
  active: boolean
  number: number
  part_of: number
  group: string
  message: Message
  range: Range
  related: string
  subscribers?: Subscribers
  icon?: string
}

export default class TaskClass {
  public static related(tasks: Task[]) {
    let relatedList: TaskRelated[] = []
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

    return relatedList
  }

  public static convert(molloTasks: Task[]) {
    let counterUndoneTasks = 0
    let taskList: Task[] = []

    const newsletterList = NewsletterStore.list

    molloTasks.forEach((task: Task) => {
      // Working
      task.working = false

      // Newsletter
      const newsletter = newsletterList.filter((item: Newsletter) => item.id === task.message.id)
      task.message.sendDate = newsletter[0].send

      // Date
      task.createdMoment = moment.unix(task.created)
      task.changedMoment = moment.unix(task.changed)
      task.runMoment = moment.unix(task.changed)

      // if Task is undone change runMoment to next possible Time
      if (!task.done) {

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

      taskList.push(task)
    })

    return taskList
  }
}
