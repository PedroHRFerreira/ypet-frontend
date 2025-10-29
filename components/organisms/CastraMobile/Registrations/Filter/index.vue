<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useListStore } from "~/stores/castra-mobile/registrations/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsCastraMobileRegistrationsFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	setup(props, { emit }) {
		const registrationsStore = useListStore();

		const optionsSpecies = computed<IOption[]>(() => [
			{ id: "dog", text: "Cães" },
			{ id: "cat", text: "Gatos" },
		]);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: "pending", text: "Pendente" },
			{ id: "approved", text: "aprovado" },
			{ id: "rejected", text: "reprovado" },
		]);

		const selectedDate = ref<string | null>(
			registrationsStore.filters.start_date ?? null,
		);
		const selectedSpecies = ref<string>(
			registrationsStore.filters.species ?? "",
		);
		const selectedStatus = ref<string>(registrationsStore.filters.status ?? "");
		const selectedTutor = ref<string>(registrationsStore.filters.tutor ?? "");

		const optionsTutors = computed<IOption[]>(() => [
			...registrationsStore.tutors,
		]);

		const onSpeciesSelected = (option: IOption) => {
			selectedSpecies.value = option.id as string;
		};
		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as string;
		};
		const onTutorSelected = (option: IOption) => {
			selectedTutor.value = option.id as string;
		};

		const hasChanges = computed(() => {
			return (
				selectedDate.value !== registrationsStore.filters.start_date ||
				selectedSpecies.value !== registrationsStore.filters.species ||
				selectedStatus.value !== registrationsStore.filters.status ||
				selectedTutor.value !== registrationsStore.filters.tutor
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			registrationsStore.filters.start_date = selectedDate.value;
			registrationsStore.filters.species = selectedSpecies.value;
			registrationsStore.filters.status = selectedStatus.value;
			registrationsStore.filters.tutor = selectedTutor.value;

			registrationsStore.fetchList(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter =
				selectedDate.value ||
				selectedSpecies.value ||
				selectedStatus.value ||
				selectedTutor.value;

			if (!hasAnyFilter) return;

			selectedDate.value = null;
			selectedSpecies.value = "";
			selectedStatus.value = "";
			selectedTutor.value = "";

			registrationsStore.filters.start_date = null;
			registrationsStore.filters.species = "";
			registrationsStore.filters.status = "";
			registrationsStore.filters.tutor = "";

			registrationsStore.fetchList(1);
			emit("close");
		};

		watch(
			() => props.isVisible,
			async (visible) => {
				if (visible && registrationsStore.tutors.length === 0) {
					await registrationsStore.fetchTutors();
				}
			},
		);

		return {
			optionsSpecies,
			optionsStatus,
			optionsTutors,
			selectedDate,
			selectedSpecies,
			selectedStatus,
			selectedTutor,
			onSpeciesSelected,
			onStatusSelected,
			onTutorSelected,
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
					label="Espécie"
					:options="optionsSpecies"
					:value="selectedSpecies"
					@item-selected="onSpeciesSelected"
				/>

				<MoleculesSelectsSimple
					label="Status"
					:options="optionsStatus"
					:value="selectedStatus"
					@item-selected="onStatusSelected"
				/>

				<MoleculesSelectsSimple
					label="Tutor"
					:options="optionsTutors"
					:value="selectedTutor"
					@item-selected="onTutorSelected"
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
