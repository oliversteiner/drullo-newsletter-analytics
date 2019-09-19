export interface Message {
  id: number
  title: string
  category: string
}

export interface StatusMessage {
  module: string
  status: 'loading' | 'start' | 'finish' | 'error'
  progress?: string | number
  count?: number
  message?: string
}

export default class MessageClass {}
