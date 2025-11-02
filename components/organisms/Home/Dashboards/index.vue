<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "OrganismsHomeDashboards",
	setup() {
		const dashboards: DashboardType[] = [
			{
				id: 1,
				title: "Pets",
				value: 3,
				difference: "+0",
				subtitle: "Desde o mês passado",
			},
			{
				id: 2,
				title: "Castrações",
				value: 0,
				difference: "+0",
				subtitle: "Desde o mês passado",
			},
			{
				id: 3,
				title: "Adoções",
				value: 0,
				difference: "+0",
				subtitle: "Desde o mês passado",
			},
		];

		return {
			dashboards,
		};
	},
});
</script>

<template>
	<div class="dashboard-container">
		<MoleculesDashboardCard
			v-for="dashboard in dashboards"
			:key="dashboard.id"
			:title="dashboard.title"
			:value="dashboard.value"
			:difference="dashboard.difference"
			:subtitle="dashboard.subtitle"
		/>
	</div>
</template>

<style scoped lang="scss">
.dashboard-container {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
	padding: 0 8px;

	// Diminui o tamanho visual do card
	.dashboard-card {
		padding: 16px !important;
		min-height: 110px;
	}
}

@media (max-width: 900px) {
	.dashboard-container {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 579.98px) {
	.dashboard-container {
		grid-template-columns: 1fr;
	}
}
</style>
