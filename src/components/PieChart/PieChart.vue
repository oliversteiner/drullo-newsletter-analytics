<template>
  <div class="pie-chart">
    Pie Chart
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PieChart extends Vue {}
</script>

<style scoped>
@import '_PieChart.scss';
</style>
