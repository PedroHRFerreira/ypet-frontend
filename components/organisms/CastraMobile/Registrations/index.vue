<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import { useListStore } from "~/stores/castra-mobile/registrations/useListStore";

export default defineComponent({
	name: "OrganismsCastraMobileRegistrations",
	components: {
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const listStore = useListStore();
		const isVisible = ref(false);

		const header = computed(() => {
			return {
				title: "Agenda do dia",
				subtitle: "",
				buttons: [
					{
						text: "Registrar",
						type: "primary",
						icon: "plus",
						iconLeft: true,
						nameIconLeft: "plus",
						iconRight: false,
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.push({ name: "castra-mobile.registrations.create" });
						},
					},
				],
			};
		});

		const list = computed((): IRegistration[] => {
			return listStore.list;
		});

		const columnsHeader = ref([
			{
				value: "id",
				text: "ID",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "5%", wordBreak: "break-all" },
			},
			{
				value: "hour",
				text: "DATA E HORA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "15%", wordBreak: "break-all" },
			},
			{
				value: "tutor",
				text: "TUTOR",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "15%" },
			},
			{
				value: "pet",
				text: "PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "15%" },
			},
			{
				value: "species",
				text: "ESPÉCIES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%", justifyContent: "flex-end" },
			},
			{
				value: "weight",
				text: "PESO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "10%", justifyContent: "flex-end" },
			},
			{
				value: "status",
				text: "STATUS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "10%", justifyContent: "flex-end" },
			},
			{
				value: "actions",
				text: "AÇÕES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "10%", justifyContent: "flex-end" },
			},
		]);

		const onSelectOptionAction = (event: string, item: IRegistration) => {
			const router = useRouter();

			if (event === "details") {
				router.push({
					name: "castra-mobile.registrations.details",
					params: { id: item.id },
				});
			}

			if (event === "pre_surgery_assessment") {
				router.push({
					path: `/castra-mobile/registrations/${item.animal_id}/pre-surgery-assessment`,
				});
			}

			if (event === "download_term") {
				listStore.downloadTerm(item.id);
			}
		};

		onMounted(async () => {
			await listStore.fetchList();
		});

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		return {
			listStore,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
			toggleDropdown,
			isVisible,
		};
	},
	methods: {
		useDayjs,
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
			<div class="wrapper-list-card__search-input anim-loading">
				<MoleculesButtonsCommon
					type="outline"
					text="Filtros"
					size="small"
					icon-left
					name-icon-left="filter"
					@onclick="toggleDropdown"
				/>
			</div>
		</div>
		<div v-if="list.length > 0" class="wrapper-list-card__body">
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

			<MoleculesListCardItem
				v-for="(item, key) in list"
				:key="key"
				:data="columnsHeader"
				padding="0"
			>
				<template #id>
					<AtomsTypography
						type="text-p5"
						:text="`#${item.id}`"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #hour>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.scheduler_at).format('DD/MM/YYYY - HH:mm')"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #tutor>
					<AtomsTypography
						type="text-p5"
						:text="item.user?.name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #pet>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #species>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.species.label || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #weight>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.weight ? `${item.animal.weight} kg` : '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #status>
					<AtomsTypography
						type="text-p5"
						:text="item.status.label"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						:actions="[
							{ value: 'details', label: 'Detalhes' },
							{ value: 'pre_surgery_assessment', label: 'Triagem' },
							{ value: 'download_term', label: 'Baixar termo' },
						]"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>

		<MoleculesEmptyState
			v-else
			:is-icon="true"
			title="Nenhum agendamento encontrado"
			description="Adicione um novo agendamento para começar."
		/>

		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="listStore.pagination"
				:total-items="listStore.pagination.total || 0"
				:current-page="listStore.pagination.current_page || 1"
				:per-page="listStore.pagination.per_page || 10"
			/>
		</div>

		<OrganismsCastraMobileRegistrationsFilter
			:is-visible="isVisible"
			@close="isVisible = false"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";

.wrapper-list-card__header-actions {
	display: flex;
	align-items: center;
	gap: 16px;

	.filter-input,
	.filter-select {
		height: 36px;
		padding: 6px 12px;
		font-size: 14px;
		color: var(--brand-color-dark-blue-300);
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		background-color: var(--brand-color-white);
		cursor: pointer;
		transition: border-color 0.2s;

		&:hover {
			border-color: var(--brand-color-dark-blue-300);
		}

		&:focus {
			outline: none;
			border-color: var(--brand-color-dark-blue-300);
			box-shadow: 0 0 0 2px rgba(0, 55, 122, 0.1);
		}
	}
}
</style>
