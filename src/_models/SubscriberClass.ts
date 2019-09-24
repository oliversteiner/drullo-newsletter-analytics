import getSubscriberStatus from '@/_helper/subscriberStatus'
import { EnumsSubscriberStatus } from '@/enums'
import { CountryTerm, GenderTerm, OriginTerm, SubscriberGroupTerm } from '@/_models/mollo'
import { MolloMember, MolloMemberTelemetry } from '@/_models/MolloMember'

export interface SubscriberContact {
  email?: string
  mobile?: string
  phone?: string
  phone2?: string
}
interface SubscriberPersonal {
  gender?: GenderTerm[]
  firstName?: string
  lastName?: string
  birthday?: string
  newsletter?: boolean
}

interface SubscriberAddress {
  streetAndNumber?: string
  zipCode?: string
  city?: string
  country?: CountryTerm[]
}

export interface Subscriber {
  id: number
  changed?: Date
  created?: Date
  changedTs?: number
  createdTs?: number
  contact?: SubscriberContact
  personal?: SubscriberPersonal
  address?: SubscriberAddress
  error?: boolean
  read?: boolean
  groups: SubscriberGroupTerm[]
  origin?: OriginTerm[]
  telemetry?: MolloMemberTelemetry[]
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

export interface SubscriberGroupsResponse {
  subscriberGroups: SubscriberGroupTerm[]
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

export default class SubscriberClass {
  public static convertMemberToSubscribers(members: MolloMember[]): Subscriber[] {
    const subscribers: Subscriber[] = []

    if (members) {
      members.forEach((member: MolloMember) => {
        let duplicate = false

        // check for duplicates
        subscribers.forEach((subscriber: Subscriber) => {
          if (subscriber.id == member.id) {
            duplicate = true
          }
        })
        let personal: SubscriberPersonal = {}
        if (member.personal) {
          personal = {
            gender: member.personal.gender,
            firstName: member.personal.first_name,
            lastName: member.personal.last_name,
            birthday: member.personal.birthday,
            newsletter: member.personal.newsletter,
          }
        }

        let address: SubscriberAddress = {}
        if (member.address) {
          address = {
            streetAndNumber: member.address.street_and_number,
            zipCode: member.address.zip_code,
            city: member.address.city,
            country: member.address.country,
          }
        }

        let contact: SubscriberContact = {}
        if (member.contact) {
          contact = {
            email: member.contact.email,
            phone: member.contact.phone,
            phone2: member.contact.phone_2,
            mobile: member.contact.mobile,
          }
        }
        if (!member.groups) {
          member.groups = []
        }


        if (!member.telemetry) {
          member.telemetry = []
        }
        let id = 0
        if (member.id) {
          id = member.id
        }

        const subscriber: Subscriber = {
          id: id,
          personal: personal,
          contact: contact,
          address: address,
          error: false,
          read: false,
          groups: member.groups,
          origin: member.origin,
          telemetry: member.telemetry,
          status: getSubscriberStatus(member.telemetry),
        }

        if (member.created) {
          subscriber.changedTs = member.changed
          subscriber.created = new Date(member.created * 1000)
        }

        if (member.changed) {
          subscriber.createdTs = member.created
          subscriber.changed = new Date(member.changed * 1000)
        }

        // Add new Subscriber to list
        if (!duplicate) {
          subscribers.push(subscriber)
        }
      })
    }
    return subscribers
  }
}
