<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import type { IOption } from "~/types/global";
import { useListStore } from "~/stores/animals/useListStore";

export default defineComponent({
	name: "OrganismsAnimalsFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close", "clear-all"],
	setup(_, { emit }) {
		const locationsStore = useListStore();

		const optionsType = computed<IOption[]>(() => [
			{ id: "dog", text: "Cães" },
			{ id: "cat", text: "Gatos" },
		]);

		const selectedType = ref<string | null>(
			locationsStore.filters.species ?? null,
		);
		const registrationInput = ref<string>(
			locationsStore.filters.registration_number ?? "",
		);

		const onTypeSelected = (option: IOption) => {
			selectedType.value = option.id as string | null;
		};

		const hasChanges = computed(() => {
			return (
				locationsStore.filters.species !== selectedType.value ||
				locationsStore.filters.registration_number !==
					registrationInput.value ||
				locationsStore.filters.name !== null
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			locationsStore.filters.species = selectedType.value;
			locationsStore.filters.registration_number =
				registrationInput.value || null;

			locationsStore.fetchAnimals();
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter =
				selectedType.value !== null || registrationInput.value.trim() !== "";

			if (!hasAnyFilter) return;

			selectedType.value = null;
			registrationInput.value = "";
			locationsStore.filters.species = null;
			locationsStore.filters.registration_number = null;
			locationsStore.filters.name = null;

			locationsStore.fetchAnimals();
			emit("clear-all");
			emit("close");
		};

		return {
			optionsType,
			selectedType,
			registrationInput,
			onTypeSelected,
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
				<MoleculesSelectsSimple
					label="Tipo"
					:options="optionsType"
					:value="selectedType"
					@item-selected="onTypeSelected"
				/>

				<MoleculesInputCommon
					label="Inscrição"
					:value="registrationInput"
					@on-input="(val) => (registrationInput = val)"
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
