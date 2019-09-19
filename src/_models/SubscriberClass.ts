import getSubscriberStatus from '@/_helper/subscriberStatus'
import { EnumsSubscriberStatus } from '@/enums'
import { Address, Contact, Origin } from '@/_models/models'

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

export interface SubscriberGroup {
  id: number
  name: string
  subscribers?: number
}

export interface SubscriberGroupsResponse {
  subscriberGroups: SubscriberGroup[]
}

export interface SubscriberStatus {
  messageId: number
  status: EnumsSubscriberStatus
}

export interface SubscriberTimeline {
  send: { t: Date; y: number }[]
  open: { t: Date; y: number }[]
  unsubscribe: { t: Date; y: number }[]
  error: { t: Date; y: number }[]
  label: string[]
  timestamp?: number[]
}

export interface SubscriberCountResponse {
  countMembers: number
}

// ------------- Member -------------

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

export interface MemberResponse {
  count: number
  set: number
  start?: number
  length?: number
  subscriberGroups: number
  members: Member[]
}

export interface MolloMemberData {
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

export default class SubscriberClass {
  public static convertMemberToSubscribers(members: Member[]): Subscriber[] {
    const subscribers: Subscriber[] = []

    if (members) {
      members.forEach((member: Member) => {
        let duplicate = false
        const subscriber: Subscriber = {
          id: member.id,
          contact: member.contact,
          address: member.address,
          error: false,
          read: false,
          newsletter: member.newsletter,
          groups: member.groups,
          origin: member.origin,
          data: member.data,
          status: getSubscriberStatus(member.data),
        }

        subscriber.createdTs = member.created
        subscriber.changedTs = member.changed
        subscriber.created = new Date(member.created * 1000)
        subscriber.changed = new Date(member.changed * 1000)

        // check for duplicates
        subscribers.forEach((subscriber: Subscriber) => {
          if (subscriber.id == member.id) {
            duplicate = true
          }
        })

        // Add new Subscriber to list
        if (!duplicate) {
          subscribers.push(subscriber)
        }
      })
    }
    return subscribers
  }
}
