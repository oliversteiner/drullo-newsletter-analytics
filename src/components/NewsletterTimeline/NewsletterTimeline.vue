<template>
  <div class="newsletter-timeline">
    <LineChart :stl="dataTimeline" :styles="chartStyle"></LineChart>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import LineChart from '@/components/NewsletterTimeline/LineChart'
import getSubscriberTimeline from '@/_helper/subscriberTimeline'
import { Subscriber, SubscriberTimeline } from '@/_models/SubscriberClass'

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
