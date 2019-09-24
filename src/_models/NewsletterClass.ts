import { CategoryTerm, SubscriberGroupTerm } from '@/_models/mollo'

export interface Newsletter {
  id: number
  title: string
  createdTs: number
  created: Date
  changedTs: number
  changed: Date
  category: CategoryTerm[]
  text: string
  subscriberGroups: SubscriberGroupTerm[]
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

// ---------- Mollo Message ----------

export interface MolloMessage {
  id: number
  title: string
  created: number
  changed: number
  category: CategoryTerm[]
  text: string
  subscriberGroups: SubscriberGroupTerm[]
  isSend: boolean
  send: number
  isTemplate: boolean
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

export default class NewsletterClass {}
