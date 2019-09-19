import { Moment } from 'moment'
import { TaskStatus, TaskStatusMessage } from '@/enums'
import { Subscribers } from '@/_models/SubscriberClass'
import { Range } from '@/_models/models'
import { Message } from '@/_models/MessageClass'

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

export default class TaskClass {}
