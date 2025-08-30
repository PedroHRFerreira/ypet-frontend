<script lang="ts">
import { defineComponent, ref } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
	name: "MoleculesDashboardDoughnut",
	components: {
		Doughnut,
	},
	setup() {
		const total = ref(590);
		const title = ref("Animais cadastrados");

		const chartData = ref({
			labels: ["Abrigados", "Abandonos"],
			datasets: [
				{
					data: [70, 30],
					backgroundColor: ["#334494", "#C8D4FA"],
					borderWidth: 0,
					cutout: "80%",
				},
			],
		});

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
				},
			},
		});

		const legendItems = ref([
			{
				label: "Abandonos",
				bulletClass: "bullet-abandono",
				trend: "↓ 40%",
				trendClass: "down",
			},
			{
				label: "Abrigados",
				bulletClass: "bullet-abrigado",
				trend: "↑ 30%",
				trendClass: "up",
			},
		]);

		return {
			title,
			total,
			chartData,
			chartOptions,
			legendItems,
		};
	},
});
</script>

<template>
	<div class="chart-card">
		<div class="header">
			<h2>{{ title }}</h2>
			<button class="menu-button" aria-label="Opções">
				<span class="dot" />
				<span class="dot" />
				<span class="dot" />
			</button>
		</div>

		<div class="chart-container">
			<Doughnut :data="chartData" :options="chartOptions" />
			<div class="center-text">
				<span class="value">{{ total }}</span>
				<span class="label">Último mês</span>
			</div>
		</div>

		<div class="legend">
			<div v-for="(item, idx) in legendItems" :key="idx" class="legend-item">
				<div>
					<span class="bullet" :class="item.bulletClass"></span>
					<span class="label">{{ item.label }}</span>
				</div>
				<span class="trend" :class="item.trendClass">{{ item.trend }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
