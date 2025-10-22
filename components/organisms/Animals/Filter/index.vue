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
			locationsStore.filters.type ?? null,
		);
		const registrationInput = ref<string>(
			locationsStore.filters.registration ?? "",
		);

		const onTypeSelected = (option: IOption) => {
			selectedType.value = option.id as string | null;
		};

		const hasChanges = computed(() => {
			return (
				locationsStore.filters.type !== selectedType.value ||
				locationsStore.filters.registration !== registrationInput.value ||
				locationsStore.filters.name !== null
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			locationsStore.filters.type = selectedType.value;
			locationsStore.filters.registration = registrationInput.value || null;

			locationsStore.fetchAnimals();
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter =
				selectedType.value !== null || registrationInput.value.trim() !== "";

			if (!hasAnyFilter) return;

			selectedType.value = null;
			registrationInput.value = "";
			locationsStore.filters.type = null;
			locationsStore.filters.registration = null;
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
