import { Subscriber, SubscriberTimeline } from '@/models/models'

/**
 *
 * Timeline:
 *
 * @param subscribers
 */
export default function getSubscriberTimeline(subscribers: Subscriber[]): SubscriberTimeline {
  const timeline: SubscriberTimeline = {
    label: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    send: [2300, 0, 520, 0, 0, 0, 0],
    open: [1360, 556, 120, 20, 5, 0, 2],
    unsubscribe: [150, 20, 0, 0, 2, 0, 0],
    error: [535, 0, 62, 0, 0, 2, 10],
  }

  // no Data
  //  if (!subscribers) return timeline

  // Data
  subscribers.forEach(sub => {
    //  timeline.push(message)
  })

  return timeline
}
