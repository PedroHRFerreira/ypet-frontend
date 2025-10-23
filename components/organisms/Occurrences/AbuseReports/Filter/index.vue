<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useListStore } from "~/stores/report/useListStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsOccurrencesAbuseReportsFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	setup(_, { emit }) {
		const abuseReportList = useListStore();

		const selectedDate = ref<string | null>(
			abuseReportList.filters.date ?? null,
		);
		const selectedStatus = ref<number | null>(
			abuseReportList.filters.status ?? null,
		);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: 1, text: "Em revisão" },
			{ id: 2, text: "Encaminhados" },
			{ id: 3, text: "Concluídos" },
			{ id: 4, text: "Arquivados" },
		]);

		const onStatusSelected = (option: IOption) => {
			selectedStatus.value = option.id as number;
		};

		const hasChanges = computed(() => {
			return (
				selectedDate.value !== abuseReportList.filters.date ||
				selectedStatus.value !== abuseReportList.filters.status
			);
		});

		const applyFilters = () => {
			if (!hasChanges.value) return;

			abuseReportList.filters.date = selectedDate.value;
			abuseReportList.filters.status = selectedStatus.value;

			abuseReportList.fetchList(1);
			emit("close");
		};

		const clearFilters = () => {
			const hasAnyFilter = selectedDate.value || selectedStatus.value;

			if (!hasAnyFilter) return;

			selectedDate.value = null;
			selectedStatus.value = null;

			abuseReportList.filters.date = null;
			abuseReportList.filters.status = null;

			abuseReportList.fetchList(1);
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
