import { Line } from 'vue-chartjs'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ColorClass from '@/_models/ColorClass'
import { SubscriberTimeline } from '@/_models/SubscriberClass'

// @ts-ignore
@Component({
  extends: Line,
})
export default class PieChart extends Vue<Line> {
  @Prop() private stl!: SubscriberTimeline

  private colors = new ColorClass()

  private get chartData(): any {
    if (!this.stl) {
      return 0
    }
    const labels = this.stl.label
    const datasets = [
      {
        // error
        label: 'Fehler',
        data: this.stl.error,
        borderColor: 'none',
        backgroundColor: this.colors.error.background,
        yAxisID: 'y-axis-1',
      },
      {
        // unsubscribe
        label: 'Abgemeldet',
        data: this.stl.unsubscribe,
        borderColor: this.colors.unsubscribe.border,
        backgroundColor: this.colors.unsubscribe.background,
        yAxisID: 'y-axis-1',
      },

      {
        // open
        label: 'Geöffnet',
        data: this.stl.open,
        borderColor: this.colors.open.border,
        backgroundColor: this.colors.open.background,
        yAxisID: 'y-axis-1',
      },
      {
        // send
        label: 'Gesendet',
        data: this.stl.send,
        borderColor: this.colors.send.border,
        backgroundColor: this.colors.send.background,
        yAxisID: 'y-axis-1',
        steppedLine: 'before',
      },
    ]
    return { labels, datasets }
  }

  private chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    hoverMode: 'index',
    stacked: false,
    legend: { display: false },
    title: {
      display: false,
      text: 'Tagesverlauf',
    },
    scales: {
      xAxes: [
        {
          time: {
            displayFormats: {
              hour: 'h:mm',
            },
          },
        },
      ],
      yAxes: [
        {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            beginAtZero: true,
            //  stepSize: 100,
          },
        },
      ],
    },
  }

  private renderData(): void {
    // Overwriting base render method with actual data.
    const chartData = this.chartData

    this.renderChart(chartData, this.chartOptions)
  }

  // Change Input
  @Watch('stl')
  private updateData(): void {
    this.renderData()
  }

  // Mounted
  public mounted(): void {
    this.renderData()
  }
}
