<template>
  <div class="developer-page">
    <h1>Develop</h1>

    <vue-json-pretty :path="'res'" :data="timelineData" @click="handleClick"></vue-json-pretty>

    <div>
      <ul>
        <li v-for="subscriber in filterdSubscribers">
          {{ subscriber.id }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import subscribers from '@/store/modules/subscribers'
import { EnumsSubscriberStatus } from '@/enums'
import { Subscriber, SubscriberTimeline } from '@/models/models'
import VueJsonPretty from 'vue-json-pretty'
import formatTimestamp from '@/_helper/timestampFormat'
import getfilterdSubscribers from '@/_helper/filterdSubscribers'

@Component({
  components: { VueJsonPretty },
})
export default class DeveloperPage extends Vue {
  subGroupId = 44
  newsletterId = 3240

  handleClick() {}

  get timelineData() {


    let timeline: SubscriberTimeline = {
      label: [],
      send: [],
      open: [],
      unsubscribe: [],
      error: [],
    }
    // no Data
    if (!subscribers) return timeline

    const subscribers = this.filterdSubscribers

    console.log('Subscriber:', subscribers[0])

    let sendTSs: number[] = []
    let TimelineInHourTS: number[] = []
    let TimelineInHourSend: { hour: string; count: number }[] = []
    let TimelineInHourOpen: { hour: string; count: number }[] = []
    let TimelineInHourUnsu: { hour: string; count: number }[] = []

    const formatString = 'Y-M-D:H'
    // Data
    subscribers.forEach(subscriber => {
      //  timeline.push(message)

      // Send Timeline
      // console.log('subscriber.data', subscriber.data[0])

      const data = subscriber.data[0]

      // Send
      if (data.send) {
        const sendTS = data.sendTS
        sendTSs.push(sendTS)
        const sendH: string = formatTimestamp(sendTS, formatString)

        const find = TimelineInHourSend.filter(item => item.time == sendH)

        if (find.length == 0) {
          TimelineInHourSend.push({ time: sendH, count: 1 })
        } else {
          find[0].count++
        }
      }

      // open
      if (data.open) {
        const openTS = data.openTS
        const openH = formatTimestamp(openTS, formatString)

        const find = TimelineInHourOpen.filter(item => item.time == openH)

        if (find.length == 0) {
          TimelineInHourOpen.push({ time: openH, count: 1 })
        } else {
          find[0].count++
        }
      }

      // unsubscribe
      if (data.unsubscribe) {
        const unsubTS = data.unsubscribeTS
        const unsubH = formatTimestamp(unsubTS, formatString)

        const find = TimelineInHourUnsu.filter(item => item.time == unsubH)

        if (find.length == 0) {
          TimelineInHourUnsu.push({ time: unsubH, count: 1 })
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
    for (let i = 0; i < 48; i++) {
      const newTS = startTS + i * 3600 // +1h
      const TS = formatTimestamp(newTS, formatString)
      TimelineInHour.push(TS)
      TimelineInHourTS.push(newTS)
    }

    console.log('TimelineInHour:', TimelineInHour)

    TimelineInHour.forEach((stepH: string) => {
      // send
      const find1 = TimelineInHourSend.filter(item => item.time == stepH)
      if (find1.length == 0) {
        TimelineInHourSend.push({ time: stepH, count: 0 })
      }

      // Open
      const find2 = TimelineInHourOpen.filter(item => item.time == stepH)
      if (find2.length == 0) {
        TimelineInHourOpen.push({ time: stepH, count: 0 })
      }

      // unsubscribe
      const find3 = TimelineInHourUnsu.filter(item => item.time == stepH)
      if (find3.length == 0) {
        TimelineInHourUnsu.push({ time: stepH, count: 0 })
      }
    })

    // Sort by hour key
    TimelineInHourOpen.sort((a, b) => a.time.localeCompare(b.time))

    console.log('TimelineInHourSend', TimelineInHourSend)
    console.log('TimelineInHourOpen', TimelineInHourOpen)
    console.log('TimelineInHourUnsu', TimelineInHourUnsu)

    // build chartjs axis:

    const timestampAxis = TimelineInHourTS
    const sendAxis = TimelineInHourSend.map(item => {
      return item.count
    })
    const openAxis = TimelineInHourOpen.map(item => {
      return item.count
    })
    const unsubscribAxis = TimelineInHourUnsu.map(item => {
      return item.count
    })

    timeline = {
      label: [],
      timestamp: timestampAxis,
      send: sendAxis,
      open: openAxis,
      unsubscribe: unsubscribAxis,
    }

    return timeline
  }

  get filterdSubscribers(): Subscriber[] {
    // console.log('newSubscribers', subscribers.list)

    return getfilterdSubscribers(subscribers.list, this.newsletterId, this.subGroupId)
  }

  async create() {
    await subscribers.refreshSubscriberList()
  }
}
</script>

<style lang="scss">
@import 'DeveloperPage';
</style>
