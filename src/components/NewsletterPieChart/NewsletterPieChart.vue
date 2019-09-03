<template>
  <div class="newsletter-pie-chart">
    <PieChart :chart-data="dataStatistic"></PieChart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PieChart from '@/components/NewsletterPieChart/PieChart'
import { Statistic } from '@/models/models'

// @ts-ignore
@Component({
  components: { PieChart },
})
export default class NewsletterPieChart extends Vue {
  @Prop() dataStatistic!: Statistic

  // Change Input
  @Watch('dataStatistic')
  updateData() {
    console.log('-- dataStatistic 1', this.dataStatistic)
  }
}
</script>

<style lang="scss" scoped>
@import 'NewsletterPieChart';
</style>
