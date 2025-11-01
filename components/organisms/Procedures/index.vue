<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useListStore } from "~/stores/procedures/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import MoleculesEmptyState from "~/components/molecules/EmptyState/index.vue";
import MoleculesPaginationControls from "~/components/molecules/PaginationControls/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";

export default defineComponent({
	name: "OrganismsProcedures",
	components: {
		AtomsTypography,
		MoleculesListCardItem,
		MoleculesEmptyState,
		MoleculesPaginationControls,
	},
	setup() {
		const proceduresList = useListStore();

		onMounted(() => {
			proceduresList.fetchList();
		});

		const header = computed(() => {
			return {
				title: "Todos os procedimentos cadastrados",
				subtitle: "",
			};
		});

		const list = computed((): IProcedure[] => {
			return proceduresList.procedures;
		});

		async function paginationChange(value: number) {
			await proceduresList.fetchList({ page: value });
		}

		const columnsHeader = ref([
			{
				value: "type",
				text: "TIPO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "25%", justifyContent: "flex-start" },
			},
			{
				value: "performed_at",
				text: "DATA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "15%", justifyContent: "flex-start" },
			},
			{
				value: "animal",
				text: "ANIMAL",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "30%", justifyContent: "flex-start" },
			},
		]);

		return {
			proceduresList,
			columnsHeader,
			header,
			list,
			paginationChange,
		};
	},
});
</script>

<template>
	<section class="wrapper-list-card">
		<div class="wrapper-list-card__header">
			<div class="wrapper-list-card__header-title">
				<AtomsTypography
					type="title-h7"
					:text="header.title"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
		</div>
		<div class="wrapper-list-card__body">
			<MoleculesListCardItem :data="columnsHeader" padding="16px 0">
				<template v-for="(item, key) in columnsHeader" #[item.value] :key="key">
					<AtomsTypography
						:type="item.typeTypography"
						:text="item.text"
						:weight="item.weightTypography"
						:color="item.colorTypography"
					/>
				</template>
			</MoleculesListCardItem>

			<template v-if="list.length > 0">
				<MoleculesListCardItem
					v-for="(item, key) in list"
					:key="key"
					:data="columnsHeader"
					padding="0"
				>
					<template #type>
						<AtomsTypography
							type="text-p5"
							:text="(item.type as any)?.label ?? String(item.type ?? '---')"
							weight="regular"
							color="var(--brand-color-dark-blue-300)"
						/>
					</template>
					<template #performed_at>
						<AtomsTypography
							type="text-p5"
							:text="$formatDate(item.performed_at || item.created_at)"
							weight="regular"
							color="var(--brand-color-dark-blue-300)"
						/>
					</template>
					<template #animal>
						<AtomsTypography
							type="text-p5"
							:text="String(item.animal?.name ?? '---')"
							weight="regular"
							color="var(--brand-color-dark-blue-300)"
						/>
					</template>
				</MoleculesListCardItem>
			</template>
			<template v-else>
				<MoleculesEmptyState
					:is-icon="true"
					title="Nenhum procedimento encontrado"
					description="Adicione um novo cadastro para começar."
				/>
			</template>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="proceduresList.pagination"
				:total-items="proceduresList.pagination.total"
				:current-page="proceduresList.pagination.current_page"
				:per-page="proceduresList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
