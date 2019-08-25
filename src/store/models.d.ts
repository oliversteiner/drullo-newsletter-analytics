import {Moment} from 'moment'
import {TaskStatus, TaskStatusMessage} from '@/enums'

export interface TasksResponse {
  tasks?: (Task)[] | null
  tasksCount: number
}

export interface Address {
  id: number
  email: string
  error: boolean
  open: boolean
}

export interface Addresses {
  all?: number
  error?: number
  open?: number
  list?: Address[]
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
  addresses?: Addresses
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

interface Subscribers {
  id: number
  name: string
}

export interface Newsletter {
  title: string
  date: Date
  category: string
  subscribers: Subscribers[]
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



