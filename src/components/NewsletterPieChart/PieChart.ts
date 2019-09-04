// CommitChart.ts
import { Pie } from 'vue-chartjs'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Statistic } from '@/models/models'
import Colors from '@/models/colors'

// @ts-ignore
@Component({
  extends: Pie, // this is important to add the functionality to your component
})
export default class PieChart extends Vue<Pie> {
  @Prop() private chartData!: Statistic

  private colors = new Colors()

  private renderData() {
    // Overwriting base render method with actual data.

    const unread = this.chartData.send - ( this.chartData.open+ this.chartData.unsubscribe+ this.chartData.error)

    this.renderChart({
      labels: ['Ungelesen', 'Geöffnet', 'Abmeldungen', 'Fehler'],
      datasets: [
        {
          label: '',
          backgroundColor: [
            this.colors.send.background,
            this.colors.open.background,
            this.colors.unsubscribe.background,
            this.colors.error.background,
          ],
          borderColor: [
            this.colors.send.border,
            this.colors.open.border,
            this.colors.unsubscribe.border,
            this.colors.error.border,
          ],
          data: [unread, this.chartData.open, this.chartData.unsubscribe, this.chartData.error],
        },
      ],
      borderWidth: 0,
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
