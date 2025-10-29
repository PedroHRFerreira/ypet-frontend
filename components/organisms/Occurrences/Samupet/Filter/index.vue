<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useListStore } from "~/stores/animal-ambulance/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsOccurrencesSamupetFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	setup(_, { emit }) {
		const evaluationPetList = useListStore();

		const selectedDate = ref<string | null>(
			evaluationPetList.filters.date ?? null,
		);
		const selectedStatus = ref<string | null>(
			evaluationPetList.filters.status ?? null,
		);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: "open", text: "Aberto" },
			{ id: "designated", text: "Designado" },
			{ id: "in_attendance", text: "Em Atendimento" },
			{ id: "completed", text: "Concluído" },
		]);

		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as string;
		};

		const hasChanges = computed(() => {
			return (
				selectedDate.value !== evaluationPetList.filters.date ||
				selectedStatus.value !== evaluationPetList.filters.status
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			evaluationPetList.filters.date = selectedDate.value;
			evaluationPetList.filters.status = selectedStatus.value;

			evaluationPetList.fetchList(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter = selectedDate.value || selectedStatus.value;

			if (!hasAnyFilter) return;

			selectedDate.value = null;
			selectedStatus.value = null;

			evaluationPetList.filters.date = null;
			evaluationPetList.filters.status = null;

			evaluationPetList.fetchList(1);
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
		icon-right
		is-filter
		@close="$emit('close')"
	>
		<article class="wrapper">
			<section class="wrapper__filter">
				<MoleculesInputDate label="Data" v-model="selectedDate" />

				<MoleculesSelectsSimple
					label="Status"
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
