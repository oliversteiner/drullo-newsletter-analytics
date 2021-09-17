// CommitChart.ts
import { Pie } from 'vue-chartjs'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Statistic } from '@/_models/models'
import ColorClass from '@/_models/ColorClass'

// @ts-ignore
@Component({
  extends: Pie, // this is important to add the functionality to your component
})
export default class PieChart extends Vue<Pie> {
  @Prop() private dataStatistic!: Statistic

  private colors = new ColorClass()

  private get chartData() {
    if (!this.dataStatistic) {
      return false
    }

    const labels = ['Ungelesen', 'Geöffnet', 'Abmeldungen', 'Fehler']
    const datasets = [
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
        data: [
          this.dataStatistic.unconfirmed,
          this.dataStatistic.open,
          this.dataStatistic.unsubscribe,
          this.dataStatistic.error,
        ],
      },
    ]

    return { labels, datasets }
  }

  private chartOptions = {
    legend: { display: false },
    title: {
      display: false,
    },
  }

  private renderData(): void {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.chartOptions)
  }

  // Change Input
  @Watch('dataStatistic')
  updateData() {
    this.renderData()
  }

  // Mounted
  public mounted(): void {
    this.renderData()
  }
}
