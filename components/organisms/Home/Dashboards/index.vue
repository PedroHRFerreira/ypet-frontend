<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";

export default defineComponent({
	name: "OrganismsHomeDashboards",
	setup() {
		const metrics = ref({
			animals_current_month: 0,
			registrations_current_month: 0,
			adoptions_current_month: 0,
		});

		onMounted(async () => {
			await useFetch("/api/metrics", {
				method: "GET",
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					const data = (result?.data || {}) as Record<string, any>;
					metrics.value.animals_current_month =
						Number(data?.animals_current_month) || 0;
					metrics.value.registrations_current_month =
						Number(data?.registrations_current_month) || 0;
					metrics.value.adoptions_current_month =
						Number(data?.adoptions_current_month) || 0;
				},
				onResponseError: () => {
					// Mantém valores em 0 caso ocorra erro
				},
			});
		});

		const dashboards = computed<DashboardType[]>(() => [
			{
				id: 1,
				title: "Pets",
				value: metrics.value.animals_current_month,
				difference: "",
				subtitle: "Cadastrados esse mês",
				icon: "paw",
			},
			{
				id: 2,
				title: "Castrações",
				value: metrics.value.registrations_current_month,
				difference: "",
				subtitle: "Castrações previstas até o final do mês",
				icon: "ambulance",
			},
			{
				id: 3,
				title: "Adoções",
				value: metrics.value.adoptions_current_month,
				difference: "",
				subtitle: "Realizadas esse mês",
				icon: "cat",
			},
		]);

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
			:icon="dashboard.icon"
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
