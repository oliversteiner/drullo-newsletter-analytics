<template>
  <div class="newsletter-timeline">
    <LineChart :stl="dataTimeline" :styles="chartStyle"></LineChart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LineChart from '@/components/NewsletterTimeline/LineChart'
import { Subscriber, SubscriberTimeline } from '@/models/models'
import getSubscriberTimeline from '@/_helper/subscriberTimeline'

// @ts-ignore
@Component({
  components: { LineChart },
})
export default class NewsletterTimeline extends Vue {
  @Prop() subscribers!: Subscriber[]

  private dataTimeline: SubscriberTimeline | {} = {}

  getData() {
    this.dataTimeline = getSubscriberTimeline(this.subscribers)
  }

  get chartStyle() {
    return {
      height: '400px',
    }
  }

  // Change Input
  @Watch('subscribers')
  updateData() {
    this.dataTimeline = getSubscriberTimeline(this.subscribers)
  }

  mounted() {
    this.dataTimeline = getSubscriberTimeline(this.subscribers)
  }
}
</script>

<style lang="scss">
@import '_NewsletterTimeline.scss';
</style>
