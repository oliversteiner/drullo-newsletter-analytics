// Mollo Member
// ---------------------------------------------- //

import { CountryTerm, GenderTerm, OriginTerm } from '@/store/modules/TermsModule'
import { SubscriberGroupTerm } from '@/store/modules/SubscriberModule'

export interface MolloContact {
  email?: string
  mobile?: string
  phone?: string
  phone2?: string
}
interface MolloPersonal {
  gender?: GenderTerm[]
  firstName?: string
  lastName?: string
  birthday?: string
  newsletter?: boolean
}

interface MolloAddress {
  streetAndNumber?: string
  zipCode?: string
  city?: string
  country?: CountryTerm[]
}

export interface MolloMember {
  id?: number
  transferID?: string
  changed?: number
  created?: number
  contact?: MolloContact
  personal?: MolloPersonal
  address?: MolloAddress
  error?: boolean
  read?: boolean
  unsubscribe?: boolean
  groups?: SubscriberGroupTerm[]
  origin?: OriginTerm[]
  telemetry?: MolloMemberTelemetry[]
}

export interface MolloMemberResponse {
  count: number
  set: number
  start?: number
  length?: number
  subscriberGroups: number
  members: MolloMember[]
}

export interface MolloMemberTelemetry {
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
