<script lang="ts">
import { defineComponent } from "vue";
import { useListStore } from "~/stores/castramovel/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsOccurrencesCastramovelFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close", "clear-all"],
	setup(_, { emit }) {
		const castramovelList = useListStore();

		const optionsStatus = computed<IOption[]>(() => [
			{ id: "found", text: "Encontrado" },
			{ id: "lost", text: "Perdido" },
			{ id: "deceased", text: "Fallecido" },
		]);

		const selectedStatus = ref<number | null>(
			castramovelList.filters.status ?? null,
		);

		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as number | null;
		};

		const hasChanges = computed(() => {
			const statusChanged = castramovelList.filters.status !== selectedStatus.value;
			return statusChanged;
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			castramovelList.filters.status = selectedStatus.value;

			castramovelList.fetchList(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter =
				selectedStatus.value !== null || castramovelList.filters.status !== null;
			if (!hasAnyFilter) return;

			selectedStatus.value = null;
			castramovelList.filters.status = null;

			castramovelList.fetchList(1);
			emit("clear-all");
			emit("close");
		};

		return {
			optionsStatus,
			selectedStatus,
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
