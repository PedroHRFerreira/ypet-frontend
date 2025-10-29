<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/castramovel/useListStore";
import { useEditTypeStore } from "~/stores/castramovel/useEditTypeStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
export default defineComponent({
	name: "OrganismsOccurrencesCastramovel",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	async setup() {
		const castramovelList = useListStore();
		const castramovelEditType = useEditTypeStore();
		const id = ref(0);
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const isVisible = ref(false);
		const searchValue = ref("");
		const typeAction = ref("");
		const feedbackModal = ref({
			confirm: {
				title: "",
				description: "",
			},
			success: {
				title: "",
				description: "",
			},
		});
		await castramovelList.fetchList();

		const list = computed((): IEvaluationPet[] => {
			return castramovelList.report;
		});

		async function paginationChange(value: number) {
			await castramovelList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{
				value: "pending",
				name: "PENDING",
				label: "Pendente",
				color: "information",
			},
			{
				value: "approved",
				name: "APPROVED",
				label: "Aprovado",
				color: "success",
			},
			{
				value: "rejected",
				name: "REJECTED",
				label: "Reprovado",
				color: "danger",
			},
			{
				value: "in_analysis",
				name: "IN_ANALYSIS",
				label: "Para análise",
				color: "warning",
			},
		];

		const speciesType = {
			dog: "Cão",
			cat: "Gato",
		};

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => {
			return {
				title: "Lista de solicitação castramóvel",
				subtitle: "",
				buttons: [],
			};
		});

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (castramovelEditType.isLoading) {
				return;
			}

			await castramovelEditType.update(id.value, typeAction.value);

			if (castramovelEditType.successMessage) {
				onSuccess();
			}

			await castramovelList.fetchList();
			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
		}

		function onSuccess() {
			showSuccess.value = true;
		}

		const columnsHeader = ref([
			{
				value: "nameUser",
				text: "TUTOR",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "species",
				text: "PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "5%",
				},
			},
			{
				value: "date",
				text: "DATA AGENDA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "localUnit",
				text: "LOCAL DA UNIDADE",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
				},
			},
			{
				value: "status",
				text: "STATUS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "actions",
				text: "AÇÕES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					justifyContent: "flex-end",
				},
			},
		]);

		const onSelectOptionAction = (event: string, item: ICastraMovel) => {
			const router = useRouter();
			id.value = item.id;

			if (event === "confirm") {
				openConfirm();
				typeAction.value = "pending";
				feedbackModal.value = {
					confirm: {
						title: "Deseja confirmar o agendamento?",
						description:
							"Após confirmação, você irá visualizá-lo agenda do dia",
					},
					success: {
						title: "Aprovado com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "cancel") {
				typeAction.value = "rejected";
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja cancelar o agendamento?",
						description: "Após confirmação, o agendamento e cancelado",
					},
					success: {
						title: "Cancelado com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "details") {
				router.push({
					name: "occurrences-castramovel-details",
					params: { id: item.id },
				});
				return;
			}
		};

		const optionsActions = [
			{ value: "confirm", label: "Confirmar agendamento", icon: "check" },
			{ value: "cancel", label: "Cancelar agendamento", icon: "calendar" },
			{ value: "details", label: "Visualizar detalhes", icon: "flag" },
		];

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				castramovelList.filters.status = null;
				castramovelList.fetchList(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				castramovelList.filters.status = trimmed;
				castramovelList.fetchList(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			castramovelList.filters.status = null;
			castramovelList.fetchList(1);
		};

		return {
			speciesType,
			castramovelList,
			columnsHeader,
			header,
			list,
			optionsActions,
			showConfirm,
			showSuccess,
			feedbackModal,
			isVisible,
			searchValue,
			onSearchInput,
			onSearchEnter,
			clearSearch,
			toggleDropdown,
			confirmUpdate,
			continueFeedback,
			getStatus,
			onSelectOptionAction,
			paginationChange,
		};
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		:title="feedbackModal.confirm.title"
		:description="feedbackModal.confirm.description"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmUpdate"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		:title="feedbackModal.success.title"
		:description="feedbackModal.success.description"
		continue-text="Continuar"
		@continue="continueFeedback"
	/>
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
		<div class="wrapper-list-card__search">
			<div class="wrapper-list-card__search-input anim-loading">
				<MoleculesInputSearch
					label="Procurar"
					:value="searchValue"
					:close="!!searchValue.trim().length"
					@onInput="onSearchInput"
					@clearInput="clearSearch"
					@keydown.enter.native="onSearchEnter"
				/>
			</div>
			<div class="wrapper-list-card__search-filters anim-loading">
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
		<div v-if="list.length" class="wrapper-list-card__body">
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
				<template #nameUser>
					<AtomsTypography
						type="text-p5"
						:text="item.user.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #species>
					<AtomsTypography
						type="text-p5"
						:text="speciesType[item.animal.species.value]"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #date>
					<AtomsTypography
						type="text-p5"
						:text="
							useDayjs(item.mobile_clinic_event.start_date).format('DD/MM/YYYY')
						"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #localUnit>
					<AtomsTypography
						type="text-p5"
						:text="item.mobile_clinic_event.location.location_name ?? '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						:color="getStatus(item.status.value)?.color"
						:text="getStatus(item.status.value)?.label || '---'"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:actions="optionsActions"
						:key="item.id"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<MoleculesEmptyState
			v-else
			:is-icon="true"
			title="Nenhum animal para castramóvel"
			description="Aguarde até um animal ser cadastrado"
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="castramovelList.pagination"
				:total-items="castramovelList.pagination.total"
				:current-page="castramovelList.pagination.current_page"
				:per-page="castramovelList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
		<OrganismsOccurrencesCastramovelFilter
			:is-visible="isVisible"
			@clear-all="clearSearch"
			@close="isVisible = false"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
