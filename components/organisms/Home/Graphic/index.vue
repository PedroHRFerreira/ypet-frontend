<script lang="ts">
import { defineComponent, ref } from "vue";
import { useListStore as useCastramovelListStore } from "~/stores/castramovel/useListStore";
import { useListStore as useAnimalsListStore } from "~/stores/animals/useListStore";

export default defineComponent({
	name: "OrganismsHomeGraphic",
	setup() {
		const castraStore = useCastramovelListStore();
		const animalsStore = useAnimalsListStore();
		const header = {
			title: "Atividades mensais",
			options: [
				{
					id: "today",
					text: "Hoje",
					state: "activated",
				},
				{
					id: "week",
					text: "Última semana",
					state: "default",
				},
				{
					id: "month",
					text: "Último mês",
					state: "default",
				},
			] as IOption[],
		};

		const formatDate = (d: Date) => {
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			return `${y}-${m}-${day}`;
		};

		const getRange = (id: string) => {
			const end = new Date();
			const start = new Date();
			if (id === "today") {
				// keep same day
			} else if (id === "week") {
				start.setDate(end.getDate() - 6);
			} else if (id === "month") {
				start.setMonth(end.getMonth() - 1);
			}
			return { start: formatDate(start), end: formatDate(end) };
		};

		const monthLabels = () => {
			const names = [
				"Janeiro",
				"Fevereiro",
				"Março",
				"Abril",
				"Maio",
				"Junho",
				"Julho",
				"Agosto",
				"Setembro",
				"Outubro",
				"Novembro",
				"Dezembro",
			];
			const arr: string[] = [];
			const now = new Date();
			for (let i = 5; i >= 0; i--) {
				const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
				arr.push(names[d.getMonth()]);
			}
			return arr;
		};

		const labels = ref(monthLabels());

		const chartData = ref({
			labels,
			datasets: [
				{
					label: "Castramóvel realizados",
					data: [0, 0, 0, 0, 0, 0],
					borderColor: "#3b82f6",
					backgroundColor: "rgba(59, 130, 246, 0.1)",
					tension: 0.4,
					fill: true,
				},
				{
					label: "Adoções concluídas",
					data: [0, 0, 0, 0, 0, 0],
					borderColor: "#1e293b",
					backgroundColor: "rgba(30, 41, 59, 0.1)",
					tension: 0.4,
					fill: true,
				},
			],
		});

		const aggregateToMonths = () => {
			const now = new Date();
			const buckets: Record<string, number> = {};
			for (let i = 5; i >= 0; i--) {
				const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
					2,
					"0",
				)}`;
				buckets[key] = 0;
			}
			(castraStore.report || []).forEach((item: ICastraMovel) => {
				const raw = item.created_at || item.scheduler_at;
				if (!raw) return;
				const d = new Date(raw as any);
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
					2,
					"0",
				)}`;
				if (key in buckets) buckets[key] += 1;
			});
			const now2 = new Date();
			const data: number[] = [];
			for (let i = 5; i >= 0; i--) {
				const d = new Date(now2.getFullYear(), now2.getMonth() - i, 1);
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
					2,
					"0",
				)}`;
				data.push(buckets[key] || 0);
			}
			chartData.value.datasets[0].data = data;
			labels.value = monthLabels();
		};

		const loadByPeriod = async (id: string) => {
			const { start, end } = getRange(id);
			await castraStore.fetchList({ start_date: start, end_date: end });
			aggregateToMonths();
			// Update adoptions (animals with owner) for the selected period
			const adoptionCount = await animalsStore.fetchAnimalsWithOwnerCount({
				start_date: start,
				end_date: end,
			});
			// Place the count in the latest bucket; others as zero
			const arr = [0, 0, 0, 0, 0, 0];
			arr[arr.length - 1] = adoptionCount;
			chartData.value.datasets[1].data = arr;
		};

		const changePeriod = (selected: IOption) => {
			loadByPeriod(selected.id as string);
		};

		const loadLastSixMonths = async () => {
			const end = new Date();
			const start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
			await castraStore.fetchList({
				start_date: `${start.getFullYear()}-${String(
					start.getMonth() + 1,
				).padStart(2, "0")}-01`,
				end_date: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(
					2,
					"0",
				)}-${String(end.getDate()).padStart(2, "0")}`,
			});
			aggregateToMonths();

			// Load adoptions counts for each of the last 6 months in parallel
			const monthRanges = [] as { start: string; end: string }[];
			for (let i = 5; i >= 0; i--) {
				const mStart = new Date(end.getFullYear(), end.getMonth() - i, 1);
				const mEnd = new Date(end.getFullYear(), end.getMonth() - i + 1, 0);
				monthRanges.push({
					start: `${mStart.getFullYear()}-${String(
						mStart.getMonth() + 1,
					).padStart(2, "0")}-01`,
					end: `${mEnd.getFullYear()}-${String(mEnd.getMonth() + 1).padStart(
						2,
						"0",
					)}-${String(mEnd.getDate()).padStart(2, "0")}`,
				});
			}
			const adoptionCounts = await Promise.all(
				monthRanges.map((r) =>
					animalsStore.fetchAnimalsWithOwnerCount({
						start_date: r.start,
						end_date: r.end,
					}),
				),
			);
			chartData.value.datasets[1].data = adoptionCounts;
		};

		loadLastSixMonths();

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			width: "100%",
			height: "100%",
			plugins: {
				legend: {
					position: "top" as const,
					labels: {
						color: "#64748b",
					},
				},
				tooltip: {
					enabled: true,
					callbacks: {
						title: (tooltipItems: any) => `Mês: ${tooltipItems[0].label}`,
						label: (tooltipItem: any) => `Valor: ${tooltipItem.formattedValue}`,
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					min: 0,
					grace: "5%",
					ticks: {
						precision: 0,
						stepSize: 1000,
						color: "#94a3b8",
					},
					suggestedMax: 4000,
				},
				x: {
					ticks: {
						color: "#94a3b8",
					},
				},
			},
		});

		function updateYAxisScale() {
			const allSeries = chartData.value.datasets.map((d) => d.data as number[]);
			const maxVal = Math.max(0, ...allSeries.flat());
			if (!Number.isFinite(maxVal)) return;
			const desiredSteps = 4;
			const rawStep = Math.ceil(maxVal / desiredSteps) || 1;
			let step = Math.max(1000, Math.ceil(rawStep / 1000) * 1000);
			const suggestedMax = Math.max(
				step * desiredSteps,
				Math.ceil(maxVal / step) * step,
			);
			chartOptions.value.scales.y.ticks.stepSize = step as unknown as number;
			(chartOptions.value.scales.y as any).suggestedMax =
				suggestedMax as unknown as number;
		}

		return {
			header,
			changePeriod,
			chartData,
			chartOptions,
		};
	},
});
</script>

<template>
	<section class="wrapper-graphic">
		<div class="graphic-header">
			<AtomsTypography
				type="text-p2"
				:text="header.title"
				weight="bold"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div class="actions">
				<MoleculesSelectsSimple
					max-width="215px"
					:options="header.options"
					current-color="val(--brand-color-dark-blue-200)"
					@item-selected="changePeriod($event)"
				/>
			</div>
		</div>
		<div class="graphic-content">
			<MoleculesDashboardChart
				:chart-data="chartData"
				:chart-options="chartOptions"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
.wrapper-graphic {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	padding: 24px 16px;

	border-radius: 6px;
	background: var(
		--white,
		linear-gradient(
			0deg,
			rgba(255, 255, 255, 0.2) 0%,
			rgba(255, 255, 255, 0.2) 100%
		),
		#fff
	);
	box-shadow: 0 1px 0 0 rgba(17, 17, 17, 0.08);
}

.graphic-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
