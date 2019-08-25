import { Moment } from 'moment'
import { TaskStatus, TaskStatusMessage } from '@/enums'

export interface TasksResponse {
  tasks?: (Task)[] | null
  tasksCount: number
}

export interface NewslettersResponse {
  message: any[]
  count: number
  set: number
  start: number
  length: number
  subscriber_group: number
  newsletters?: (Newsletter)[] | null
  nids?: number[]
}

export interface Subscriber {
  id: number
  email: string
  error: boolean
  open: boolean
}

export interface Subscribers {
  all?: number
  error?: number
  open?: number
  list?: Subscriber[]
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
}

export interface Range {
  from: number
  to: number
}

export interface Message {
  id: number
  title: string
  category: string
}

export interface TaskRelated {
  related: string
  message: Message
}

interface SubscriberGroup {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

export interface Newsletter {
  id: number
  title: string
  created: number
  changed: number
  category: Category[]
  text: string
  subscriber_group: SubscriberGroup[]
  is_send: boolean
  is_template: boolean
  count: {
    all: number
    send: number
    open: number
    unsubscribe: number
  }
}

// ------------------------- //

export interface Profile {
  username: string
  bio?: string
  image?: string
  following: boolean
}

export interface User {
  email: string
  token: string
  username: string
  bio?: string
  image?: string
}

export interface UserForUpdate {
  email?: string
  username?: string
  bio?: string
  password?: string
  image?: string
}

export interface UserSubmit {
  email: string
  password: string
}

export interface UserResponse {
  user: User
}

export interface ProfileResponse {
  profile: Profile
}
