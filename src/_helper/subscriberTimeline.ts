import { Subscriber, SubscriberTimeline } from '@/models/models'
import formatTimestamp from '@/_helper/timestampFormat'
import moment from 'moment'

/**
 *
 * Timeline:
 *    - messageId: number
 *    - send: boolean
 *    - sendTS: number
 *    - open: boolean
 *    - openTS: number
 *    - unsubscribe: false
 *    - invalidEmail: boolean
 *    - error: boolean
 *    - test: boolean
 * @param subscribers
 */
export default function getSubscriberTimeline(subscribers: Subscriber[]): SubscriberTimeline {
  let timeline: SubscriberTimeline = {
    label: [],
    send: [],
    open: [],
    unsubscribe: [],
    error: [],
  }
  // no Data
  if (!subscribers) return timeline

  console.log('Subscriber:', subscribers[0])

  let sendTSs: number[] = []
  let TimelineInHourTS: number[] = []
  let TimelineInHourSend: { hour: string; count: number; timestamp: number }[] = []
  let TimelineInHourOpen: { hour: string; count: number; timestamp: number }[] = []
  let TimelineInHourUnsu: { hour: string; count: number; timestamp: number }[] = []

  const formatString = 'Y-M-D:H'
  // Data
  subscribers.forEach(subscriber => {
    // Send Timeline
    // console.log('subscriber.data', subscriber.data[0])

    const data = subscriber.data[0]

    // Send
    if (data && data.send) {
      const sendTS = data.sendTS
      sendTSs.push(sendTS)
      const sendH: string = formatTimestamp(sendTS, formatString)

      const find = TimelineInHourSend.filter(item => item.hour == sendH)

      if (find.length == 0) {
        TimelineInHourSend.push({ hour: sendH, count: 1, timestamp: 0 })
      } else {
        find[0].count++
      }
    }

    // open
    if (data && data.open) {
      const openTS = data.openTS
      const openH = formatTimestamp(openTS, formatString)

      const find = TimelineInHourOpen.filter(item => item.hour == openH)

      if (find.length == 0) {
        TimelineInHourOpen.push({ hour: openH, count: 1, timestamp: 0 })
      } else {
        find[0].count++
      }
    }

    // unsubscribe
    if (data && data.unsubscribe) {
      const unsubTS = data.unsubscribeTS
      const unsubH = formatTimestamp(unsubTS, formatString)

      const find = TimelineInHourUnsu.filter(item => item.hour == unsubH)

      if (find.length == 0) {
        TimelineInHourUnsu.push({ hour: unsubH, count: 1, timestamp: 0 })
      } else {
        find[0].count++
      }
    }
  })

  // Sort Arrays

  // Base Timeline start on first send
  const startTS = sendTSs.sort()[0]
  let TimelineInHour: any = []
  // next 24h
  for (let i = 0; i < 36; i++) {
    const newTS = startTS + i * 3600 // +1h
    const TS = formatTimestamp(newTS, formatString)
    TimelineInHour.push(TS)
    TimelineInHourTS.push(newTS)
  }

  console.log('TimelineInHour:', TimelineInHour)

  TimelineInHour.forEach((stepH: string) => {
    // send
    const find1 = TimelineInHourSend.filter(item => item.hour == stepH)
    if (find1.length == 0) {
      TimelineInHourSend.push({ hour: stepH, count: 0, timestamp: 0 })
    }

    // Open
    const find2 = TimelineInHourOpen.filter(item => item.hour == stepH)
    if (find2.length == 0) {
      TimelineInHourOpen.push({ hour: stepH, count: 0, timestamp: 0 })
    }

    // unsubscribe
    const find3 = TimelineInHourUnsu.filter(item => item.hour == stepH)
    if (find3.length == 0) {
      TimelineInHourUnsu.push({ hour: stepH, count: 0, timestamp: 0 })
    }
  })

  // Sort by hour key
  TimelineInHourOpen.sort((a, b) => a.hour.localeCompare(b.hour))

  TimelineInHourTS.forEach((timestamp: number, index) => {
    TimelineInHourSend[index].timestamp = timestamp
    TimelineInHourOpen[index].timestamp = timestamp
    TimelineInHourUnsu[index].timestamp = timestamp
  })

  const lastindex = TimelineInHourOpen.filter(item => item.count > 1).length
  const timestamp1 = TimelineInHourOpen[lastindex].timestamp
  const hours = TimelineInHourOpen.findIndex(elem => elem.timestamp === timestamp1)
  const numberOfHours = hours + 4
  console.log('Hours', hours)
  console.log('TimelineInHourSend', TimelineInHourSend)
  console.log('TimelineInHourOpen', TimelineInHourOpen)
  console.log('TimelineInHourUnsu', TimelineInHourUnsu)

  // build chartjs axis:
  const timestampAxis = TimelineInHourTS

  let i = 0
  const labelAxis = TimelineInHourTS.map(item => {
    let format = 'HH:00'
    switch (i) {
      case 24:
        format = 'd. MMM. - HH:00'
        i = 0
        break
      case 0:
        format = 'd. MMM. - HH:00'
        break
    }

    i++
    return moment.unix(item).format(format)
  })
  const sendAxis = TimelineInHourSend.map(item => {
    const date = new Date(item.timestamp)
    return { t: date, y: item.count }
  })
  const openAxis = TimelineInHourOpen.map(item => {
    const date = new Date(item.timestamp)
    return { t: date, y: item.count }
  })
  const unsubscribAxis = TimelineInHourUnsu.map(item => {
    const date = new Date(item.timestamp)
    return { t: date, y: item.count }
  })

  console.log('sendAxis', sendAxis)
  console.log('openAxis', openAxis)
  console.log('unsubscribAxis', unsubscribAxis)

  // reduce of active Times:
  labelAxis.length = numberOfHours
  timestampAxis.length = numberOfHours
  sendAxis.length = numberOfHours
  openAxis.length = numberOfHours
  unsubscribAxis.length = numberOfHours

  timeline = {
    label: labelAxis,
    timestamp: timestampAxis,
    send: sendAxis,
    open: openAxis,
    unsubscribe: unsubscribAxis,
  }

  return timeline
}
