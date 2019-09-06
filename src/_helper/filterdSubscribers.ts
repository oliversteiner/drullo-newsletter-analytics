import { Subscriber } from '@/models/models'
import { EnumsSubscriberStatus } from '@/enums'

/**
 *
 * @param subscribers
 * @param newsletterId
 * @param groupId
 */
export default function getfilterdSubscribers(
  subscribers: Subscriber[],
  newsletterId: number,
  groupId: number,
): Subscriber[] {
  let filterdSubscribersStatus: Subscriber[] = []

  // no Data
  if (!subscribers) return filterdSubscribersStatus

  const filterdSubscribers: Subscriber[] = subscribers
    .filter(subscriber => subscriber.groups.length > 0)
    .filter(subscriber => {
      let isInGroup = false
      subscriber.groups.map(group => {
        if (group.id == groupId) {
          isInGroup = true
        }
      })
      return isInGroup
    })

  // set Status based on Message ID
  filterdSubscribersStatus = filterdSubscribers.map(subscriber => {
    // new default status
    subscriber.currentStatus = EnumsSubscriberStatus.NONE
    // iterate over status
    subscriber.status.forEach(message => {
      if (message.messageId === newsletterId) {
        // add status for current Newsletter
        subscriber.currentStatus = message.status
      }
    })
    return subscriber
  })
  return filterdSubscribersStatus
}
