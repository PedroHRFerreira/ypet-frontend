<script lang="ts">
import { defineComponent } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsLocationsFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close", "clear-all"],
	setup(_, { emit }) {
		const locationsStore = useLocationsStore();

		const optionsTypeLocation = computed<IOption[]>(() => [
			{ id: "pet_hotel", text: "Hotel Pet" },
			{ id: "temporary_home", text: "Lar Temporário" },
			{
				id: "municipal_temporary_shelter",
				text: "Abrigo Temporário Municipal (em construção)",
			},
			{ id: "partner_clinics", text: "Clínicas Conveniadas" },
			{ id: "veterinary_hospital", text: "Hospital Veterinário" },
			{ id: "adopt_here", text: "Adote Aqui" },
			{ id: "shelter_protector", text: "Abrigo / Protetor" },
		]);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: 0, text: "Inativo" },
			{ id: 1, text: "Ativo" },
		]);

		const selectedType = ref<string | null>(
			locationsStore.filters.location_type ?? null,
		);
		const selectedStatus = ref<number | null>(
			locationsStore.filters.status ?? null,
		);

		const onTypeSelected = (option: IOption) => {
			selectedType.value = option.id as string | null;
		};

		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as number | null;
		};

		const hasChanges = computed(() => {
			const typeChanged =
				locationsStore.filters.location_type !== selectedType.value;
			const statusChanged =
				locationsStore.filters.status !== selectedStatus.value;
			return typeChanged || statusChanged;
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			locationsStore.filters.location_type = selectedType.value;
			locationsStore.filters.status = selectedStatus.value;

			locationsStore.fetchLocations(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter =
				selectedType.value !== null ||
				selectedStatus.value !== null ||
				locationsStore.filters.name !== null;
			if (!hasAnyFilter) return;

			selectedType.value = null;
			selectedStatus.value = null;
			locationsStore.filters.location_type = null;
			locationsStore.filters.status = null;

			locationsStore.fetchLocations(1);
			emit("clear-all");
			emit("close");
		};

		return {
			optionsTypeLocation,
			optionsStatus,
			selectedType,
			selectedStatus,
			onTypeSelected,
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
		:showModal="isVisible"
		is-filter
		@close="$emit('close')"
	>
		<article class="wrapper">
			<section class="wrapper__filter">
				<MoleculesSelectsSimple
					label="Tipo de local"
					:options="optionsTypeLocation"
					:value="selectedType"
					@item-selected="onTypeSelected"
				/>

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
					type="primary"
					text="Limpar"
					size="small"
					mode="destructive"
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
