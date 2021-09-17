// CommitChart.ts
import { Bar } from 'vue-chartjs'
import { Component, Vue } from 'vue-property-decorator'

// @ts-ignore
@Component({
  extends: Bar, // this is important to add the functionality to your component
})
export default class CommitChart extends Vue<Bar> {
  public mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'GitHub Commits',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
        },
      ],
    })
  }
}
