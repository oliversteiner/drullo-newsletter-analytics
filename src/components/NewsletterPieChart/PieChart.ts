// CommitChart.ts
import { Pie } from 'vue-chartjs'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Statistic } from '@/models/models'

// @ts-ignore
@Component({
  extends: Pie, // this is important to add the functionality to your component
})
export default class PieChart extends Vue<Pie> {
  @Prop() chartData!: Statistic

  private renderData() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Gesendet', 'Geöffnet', 'Abmeldungen'],
      datasets: [
        {
          label: '',
          backgroundColor: ['#f89bc0', '#94d8f8', '#51f867'],
          data: [this.chartData.send, this.chartData.open, this.chartData.unsubscribe],
        },
      ],
        borderWidth: 0,
      //  borderColor: [],
    })
  }

  // Change Input
  @Watch('chartData')
  updateData() {
    this.renderData()
  }

  // Mounted
  public mounted(): void {
    this.renderData()
  }
}
