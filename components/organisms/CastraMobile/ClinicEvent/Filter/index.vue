<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useListStore } from "~/stores/castra-mobile/clinic-events/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsCastraMobileClinicEventFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	setup(_, { emit }) {
		const registrationsStore = useListStore();

		const selectedDate = ref<string | null>(
			registrationsStore.filters.date ?? null,
		);
		const selectedStatus = ref<number | null>(
			registrationsStore.filters.status ?? null,
		);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: 1, text: "OPEN" },
			{ id: 2, text: "CLOSED" },
		]);

		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as number;
		};

		const hasChanges = computed(() => {
			return (
				selectedDate.value !== registrationsStore.filters.date ||
				selectedStatus.value !== registrationsStore.filters.status
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			registrationsStore.filters.date = selectedDate.value;
			registrationsStore.filters.status = selectedStatus.value;

			registrationsStore.fetchList(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter = selectedDate.value || selectedStatus.value;

			if (!hasAnyFilter) return;

			selectedDate.value = null;
			selectedStatus.value = null;

			registrationsStore.filters.date = null;
			registrationsStore.filters.status = null;

			registrationsStore.fetchList(1);
			emit("close");
		};

		return {
			selectedDate,
			selectedStatus,
			optionsStatus,
			onStatusSelected,
			applyFilters,
			clearFilters,
			hasChanges,
		};
	},
});
</script>

<template>
	<MoleculesModal
		title="Filtros"
		:show-modal="isVisible"
		is-filter
		@close="$emit('close')"
	>
		<article class="wrapper">
			<section class="wrapper__filter">
				<MoleculesInputDate label="Data" v-model="selectedDate" />

				<MoleculesSelectsSimple
					label="Situação"
					:options="optionsStatus"
					:value="selectedStatus"
					@item-selected="onStatusSelected"
				/>
			</section>

			<section class="wrapper__button">
				<MoleculesButtonsCommon
					class="cancel"
					type="secondary"
					text="Limpar"
					size="small"
					mode="normal"
					:disabled="!hasChanges"
					@onclick="clearFilters"
				/>
				<MoleculesButtonsCommon
					class="apply"
					type="primary"
					text="Aplicar"
					size="small"
					:disabled="!hasChanges"
					@onclick="applyFilters"
				/>
			</section>
		</article>
	</MoleculesModal>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
