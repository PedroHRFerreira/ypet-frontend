<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'MoleculesDashboardChart',
  components: {
    Line
  },
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
});
</script>

<template>
  <div class="chart-body">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-body {
  flex: 1;
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
