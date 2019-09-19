import { Member, Subscriber } from '@/models/models'
import getSubscriberStatus from '@/_helper/subscriberStatus'

export function convertMemberToSubscribers(members: Member[]): Subscriber[] {

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
