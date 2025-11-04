<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { useListStore as useAnimalsListStore } from "~/stores/animals/useListStore";

ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
	name: "MoleculesDashboardDoughnut",
	components: {
		Doughnut,
	},
	setup() {
		const total = ref(0);
		const animalsStore = useAnimalsListStore();
		const title = ref("Situação dos animais cadastrados");

		const chartData = ref({
			labels: ["Com dono", "Para adoção"],
			datasets: [
				{
					data: [] as number[],
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

		onMounted(async () => {
			total.value = await animalsStore.fetchAnimalsTotalCount();
			// Compute monthly trend for 'Para adoção'
			const fmt = (d: Date) =>
				`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
					2,
					"0",
				)}-${String(d.getDate()).padStart(2, "0")}`;
			const now = new Date();
			const curStart = new Date(now.getFullYear(), now.getMonth(), 1);
			const curEnd = now;
			const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);

			const [
				curTotal,
				prevTotal,
				curForAdoption,
				prevForAdoption,
				curWithOwner,
				prevWithOwner,
			] = await Promise.all([
				animalsStore.fetchAnimalsTotalCount({
					start_date: fmt(curStart),
					end_date: fmt(curEnd),
				}),
				animalsStore.fetchAnimalsTotalCount({
					start_date: fmt(prevStart),
					end_date: fmt(prevEnd),
				}),
				animalsStore.fetchAnimalsForAdoptionCount({
					start_date: fmt(curStart),
					end_date: fmt(curEnd),
				}),
				animalsStore.fetchAnimalsForAdoptionCount({
					start_date: fmt(prevStart),
					end_date: fmt(prevEnd),
				}),
				animalsStore.fetchAnimalsWithOwnerCount({
					start_date: fmt(curStart),
					end_date: fmt(curEnd),
				}),
				animalsStore.fetchAnimalsWithOwnerCount({
					start_date: fmt(prevStart),
					end_date: fmt(prevEnd),
				}),
			]);

			const curPct = curTotal > 0 ? (curForAdoption / curTotal) * 100 : 0;
			const prevPct = prevTotal > 0 ? (prevForAdoption / prevTotal) * 100 : 0;
			const delta = curPct - prevPct;
			const sign = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
			const cls = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
			const val = Math.abs(delta).toFixed(0) + "%";
			legendItems.value = [
				legendItems.value[0],
				{ ...legendItems.value[1], trend: `${sign} ${val}`, trendClass: cls },
			];

			const curOwnerPct = curTotal > 0 ? (curWithOwner / curTotal) * 100 : 0;
			const prevOwnerPct =
				prevTotal > 0 ? (prevWithOwner / prevTotal) * 100 : 0;
			const deltaOwner = curOwnerPct - prevOwnerPct;
			const signOwner = deltaOwner > 0 ? "↑" : deltaOwner < 0 ? "↓" : "→";
			const clsOwner =
				deltaOwner > 0 ? "up" : deltaOwner < 0 ? "down" : "neutral";
			const valOwner = Math.abs(deltaOwner).toFixed(0) + "%";
			legendItems.value = [
				{
					...legendItems.value[0],
					trend: `${signOwner} ${valOwner}`,
					trendClass: clsOwner,
				},
				legendItems.value[1],
			];

			chartData.value.datasets[0].data = [curWithOwner, curForAdoption];
		});

		const legendItems = ref([
			{
				label: "Com dono",
				bulletClass: "bullet-abandono",
				trend: "",
				trendClass: "neutral",
			},
			{
				label: "Para adoção",
				bulletClass: "bullet-abrigado",
				trend: "",
				trendClass: "neutral",
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
				<span class="label">pets ativos</span>
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
