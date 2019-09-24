// Mollo Member
// ---------------------------------------------- //

import { CountryTerm, GenderTerm, OriginTerm, SubscriberGroupTerm } from '@/_models/mollo'

export interface MolloContact {
  email?: string
  mobile?: string
  phone?: string
  phone_2?: string
}
interface MolloPersonal {
  gender?: GenderTerm[]
  first_name?: string
  last_name?: string
  birthday?: string
  newsletter?: boolean
}

interface MolloAddress {
  street_and_number?: string
  zip_code?: string
  city?: string
  country?: CountryTerm[]
}

export interface MolloMember {
  id?: number
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
