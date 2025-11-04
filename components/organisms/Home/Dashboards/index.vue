<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useListStore } from "~/stores/animals/useListStore";
import { useListStore as useClinicEventsListStore } from "~/stores/castra-mobile/clinic-events/useListStore";

export default defineComponent({
	name: "OrganismsHomeDashboards",
	setup() {
		const animalsStore = useListStore();

		const petsCount = computed(() => {
			const total = (animalsStore.pagination as any)?.total as
				| number
				| undefined;
			return typeof total === "number" ? total : animalsStore.animals.length;
		});

		const adoptionsCount = ref(0);
		onMounted(async () => {
			adoptionsCount.value = await animalsStore.fetchAnimalsWithOwnerCount();
		});

		// Expected castrations for next month: sum of max_registrations across clinic events within next month
		const expectedCastrations = ref(0);
		const clinicEventsStore = useClinicEventsListStore();
		const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		onMounted(async () => {
			const start = new Date();
			const end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
			await clinicEventsStore.fetchListWithoutPagination({ start_date: fmt(start), end_date: fmt(end) });
			const list = (clinicEventsStore.list as any[]) || [];
			expectedCastrations.value = list.reduce((sum, ev) => sum + (Number(ev?.max_registrations) || 0), 0);
		});

		const dashboards = computed<DashboardType[]>(() => [
			{
				id: 1,
				title: "Pets",
				value: petsCount.value,
				difference: "",
				subtitle: "Comparado ao mês anterior",
				icon: "paw",
			},
			{
				id: 2,
				title: "Castrações",
				value: expectedCastrations.value,
				difference: "",
				subtitle: "Castrações previstas até o final do mês",
				icon: "ambulance",
			},
			{
				id: 3,
				title: "Adoções",
				value: adoptionsCount.value,
				difference: "",
				subtitle: "em relação ao mês passado",
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
