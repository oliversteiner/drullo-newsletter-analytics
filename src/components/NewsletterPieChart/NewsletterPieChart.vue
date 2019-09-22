<template>
  <div class="newsletter-pie-chart">
    <PieChart :data-statistic="dataStatistic"></PieChart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PieChart from '@/components/NewsletterPieChart/PieChart'
import { Statistic } from '@/_models/models'

// @ts-ignore
@Component({
  components: { PieChart },
})
export default class NewsletterPieChart extends Vue {
  @Prop() dataStatistic!: Statistic

  // Change Input
  @Watch('dataStatistic')
  updateData() {
  }
}
</script>

<style lang="scss" scoped>
@import 'NewsletterPieChart';
</style>
