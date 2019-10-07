import getSubscriberStatus from '@/_helper/subscriberStatus'
import { EnumsSubscriberStatus } from '@/enums'
import { MolloMember, MolloMemberTelemetry } from '@/_models/MolloMember'
import { SubscriberGroupTerm } from '@/store/modules/SubscriberModule'
import { SubscriberStore } from '@/store'
import uuid from '@/_helper/uuid'

export interface SubscriberContact {
  email?: string
  mobile?: string
  phone?: string
  phone2?: string
}

export interface SubscriberPersonal {
  gender?: number
  firstName?: string
  lastName?: string
  birthday?: string
  newsletter?: boolean
}

export interface SubscriberAddress {
  streetAndNumber?: string
  zipCode?: string
  city?: string
  country?: number
}

export interface Subscriber {
  id?: number
  transferId?: string
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
  origin?: number
  telemetry: MolloMemberTelemetry[]
  status: SubscriberStatus[]
  currentStatus?: EnumsSubscriberStatus
  temp?: string | number | boolean | undefined
  firstName?: string
  lastName?: string
  email?: string
}

export interface Subscribers {
  message?: string
  all?: number
  error?: number
  read?: number
  unsubscribe?: number
  subscribers: Subscriber[]
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
            firstName: member.personal.first_name,
            lastName: member.personal.last_name,
            birthday: member.personal.birthday,
            newsletter: member.personal.newsletter,
          }

          // Gender
          personal.gender = 0
          if (member.personal.gender && member.personal.gender[0] && member.personal.gender[0].id) {
            personal.gender = member.personal.gender[0].id
          }
        }

        let address: SubscriberAddress = {}
        if (member.address) {
          address = {
            streetAndNumber: member.address.street_and_number,
            zipCode: member.address.zip_code,
            city: member.address.city,
          }

          // country
          address.country = 0
          if (member.address.country && member.address.country[0] && member.address.country[0].id) {
            address.country = member.address.country[0].id
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

        let transferId = ''
        if (member.transfer_id) {
          transferId = member.transfer_id
        }

        const subscriber: Subscriber = {
          id: id,
          transferId: transferId,
          personal: personal,
          contact: contact,
          address: address,
          error: false,
          read: false,
          groups: member.groups,
          telemetry: member.telemetry,
          status: getSubscriberStatus(member.telemetry),
        }

        subscriber.origin = 0
        if (member.origin && member.origin[0] && member.origin[0].id) {
          subscriber.origin = member.origin[0].id
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

  public static checkEmail(email: string) {
    let error = false
    let message = ''

    const mailformat = /\S+@\S+\.\S+/
    if (!email.match(mailformat)) {
      error = true
    }

    const invalidAddresses = SubscriberStore.invalidAddresses

    if (invalidAddresses.includes(email)) {
      error = true
    }

    return { error: error, message: message }
  }

  public static async create() {
    const now = new Date()
    const created = new Date().getTime()

    const subscriber: Subscriber = {
      id: 0,
      error: false,
      changedTs: created,
      createdTs: created,
      changed: now,
      created: now,
      contact: {},
      personal: {},
      address: {},
      groups: [],
      telemetry: [],
      status: [],
    }
    await SubscriberStore.addSubscriber(subscriber)
    return true
  }
}
