<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "OrganismsHomeDashboards",
	setup() {
		const dashboards: DashboardType[] = [
			{
				id: 1,
				title: "Cadastros de animais",
				value: 3,
				difference: "+0",
				subtitle: "Desde o mês passado",
			},
			{
				id: 2,
				title: "Ocorrências",
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
			{
				id: 4,
				title: "Tarefas pendentes",
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
	grid-template-columns: 1fr 1fr 1fr;
	gap: 8px;
}

@media (max-width: 900px) {
	.dashboard-container {
		grid-template-columns: 1fr 1fr;
	}
}

@media (max-width: 579.98px) {
	.dashboard-container {
		grid-template-columns: 1fr;
	}
}
</style>
