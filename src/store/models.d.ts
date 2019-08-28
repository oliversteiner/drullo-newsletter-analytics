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
  changed?: Date;
  created?: Date;
  changed_ts?: number;
  created_ts?: number
  contact: Contact
  address:Address
  error: boolean
  read: boolean
  unsubscribe:boolean
  groups?:SubscriberGroup[]
  origin:Origin

}

export interface Subscribers {
  message?:string
  all?: number
  error?: number
  read?: number
  unsubscribe?:number
  subscribers: Subscriber[]
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
  created_ts: number
  created: Date
  changed_ts: number
  changed: Date
  category: Category[]
  text: string
  subscriber_group: SubscriberGroup[]
  is_send: boolean
  send_ts: number
  send: Date
  is_template: boolean
  count: {
    all: number
    send: number
    read: number
    unsubscribe: number
  }
}

export interface MemberResponse{
  count: number
  set: number
  start?: number
  length?: number
  subscriber_group: number
  members: Member[]
}


interface Origin {
  id: number
  name: string
}

interface Contact {
  phone: string
  phone_2: string
  mobile: string
  email: string
}

interface Address {
  first_name: string
  last_name: string
  street_and_number: string
  zip_code: string
  city: string
  birthday: string
}

export interface Member {
  id: number
  name: string
  created: number
  changed: number
  token: string
  is_active: true
  transfer_id?: number
  newsletter: false
  fake: false
  address: Address
  contact: Contact
  subscriber_groups: SubscriberGroup[]
  origin: Origin
  data?: any
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


