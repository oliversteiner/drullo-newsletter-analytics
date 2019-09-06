import { Moment } from 'moment'
import { EnumsSubscriberStatus, TaskStatus, TaskStatusMessage } from '@/enums'

export interface TasksResponse {
  tasks: (Task)[]
  tasksCount: number
}

export interface MolloMessageResponse {
  message: any[]
  count: number
  set: number
  start: number
  length: number
  subscriber_group: number
  newsletters?: MolloMessage[] | null
  nids?: number[]
}

interface MolloMemberData {
  messageId: number
  send: boolean
  sendTS: number
  open: boolean
  openTS: number
  unsubscribe: false
  unsubscribeTS?: false
  invalidEmail: boolean
  invalidEmailTS?: boolean
  error: boolean
  test: boolean
}

export interface Member {
  id: number
  changed: number
  created: number
  contact: Contact
  address: Address
  error: boolean
  read: boolean
  unsubscribe: boolean
  groups: SubscriberGroup[]
  origin: Origin
  newsletter: boolean
  data: MolloMemberData[]
}

export interface Subscriber {
  id: number
  changed?: Date
  created?: Date
  changedTs?: number
  createdTs?: number
  contact: Contact
  address: Address
  error: boolean
  read: boolean
  newsletter: boolean
  groups: SubscriberGroup[]
  origin: Origin
  data: MolloMemberData[]
  status: SubscriberStatus[]
  currentStatus?: EnumsSubscriberStatus
}

export interface Subscribers {
  message?: string
  all?: number
  error?: number
  read?: number
  unsubscribe?: number
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
  icon?: string
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
  subscribers?: number
}

interface Category {
  id: number
  name: string
}
export interface MolloMessage {
  id: number
  title: string
  created: number
  changed: number
  category: Category[]
  text: string
  subscriberGroups: SubscriberGroup[]
  isSend: boolean
  send: number
  isTemplate: boolean
}

export interface Newsletter {
  id: number
  title: string
  createdTs: number
  created: Date
  changedTs: number
  changed: Date
  category: Category[]
  text: string
  subscriberGroups: SubscriberGroup[]
  isSend: boolean
  sendTs: number
  send: Date
  isTemplate: boolean
  count?: {
    all: number
    send: number
    read: number
    unsubscribe: number
  }
}

export interface MemberResponse {
  count: number
  set: number
  start?: number
  length?: number
  subscriberGroups: number
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

export interface SubscriberCountResponse {
  countMembers: number
}

export interface SubscriberGroupsResponse {
  subscriberGroups: SubscriberGroup[]
}

export interface SubscriberStatus {
  messageId: number
  status: EnumsSubscriberStatus
}

export interface SubscriberTimeline {
  send: { t: Date; y: number; }[]
  open: { t: Date; y: number; }[]
  unsubscribe: { t: Date; y: number; }[]
  error: { t: Date; y: number; }[]
  label: string[]
  timestamp?: number[]
}

interface Statistic {
  send: number
  open: number
  unsubscribe: number
  error: number
}
