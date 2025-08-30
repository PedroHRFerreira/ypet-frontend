<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "OrganismsHomeGraphic",
	setup() {
		const header = {
			title: "Cadastros",
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
				{
					id: "year",
					text: "Último ano",
					state: "default",
				},
			] as IOption[],
		};

		const changePeriod = (selected: IOption) => {
			// eslint-disable-next-line no-console
			console.log("Período selecionado:", selected);
			// TODO: Lógica para atualizar o gráfico com base no período selecionado
		};

		const labels = ref([
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
		]);

		const chartData = ref({
			labels,
			datasets: [
				{
					label: "Novos",
					data: [5000, 15000, 25000, 20000, 30000, 18000],
					borderColor: "#3b82f6",
					backgroundColor: "rgba(59, 130, 246, 0.1)",
					tension: 0.4,
					fill: true,
				},
				{
					label: "Overdue",
					data: [0, 10000, 20000, 40000, 60000, 35000],
					borderColor: "#1e293b",
					backgroundColor: "rgba(30, 41, 59, 0.1)",
					tension: 0.4,
					fill: true,
				},
			],
		});

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
					ticks: {
						callback: (value: number) => `${value / 1000}K`,
						color: "#94a3b8",
					},
				},
				x: {
					ticks: {
						color: "#94a3b8",
					},
				},
			},
		});

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
