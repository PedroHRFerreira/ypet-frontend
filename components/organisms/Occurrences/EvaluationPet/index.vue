<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/evaluation-pet/useListStore";
import { useEditTypeStore } from "~/stores/evaluation-pet/useEditTypeStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
export default defineComponent({
	name: "OrganismsOccurrencesEvaluationPet",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	async setup() {
		const evaluationPetList = useListStore();
		const evaluationPetEditType = useEditTypeStore();
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
		await evaluationPetList.fetchList();

		const list = computed((): IEvaluationPet[] => {
			return evaluationPetList.evaluationPet;
		});

		async function paginationChange(value: number) {
			await evaluationPetList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{
				value: "pending",
				name: "PENDING",
				label: "Pendente",
				color: "warning",
			},
			{
				value: "approved",
				name: "APPROVED",
				label: "Aprovado",
				color: "success",
			},
			{
				value: "refused",
				name: "REFUSED",
				label: "Reprovado",
				color: "danger",
			},
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => {
			return {
				title: "Lista de aprovação para adoção",
				subtitle: "",
				buttons: [],
			};
		});

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (evaluationPetEditType.isLoading) {
				return;
			}

			await evaluationPetEditType.update(id.value, typeAction.value);

			if (evaluationPetEditType.successMessage) {
				onSuccess();
			}

			await evaluationPetList.fetchList();
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
				text: "PROTETOR",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "nameAnimal",
				text: "PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "species",
				text: "ESPECIE",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "5%",
				},
			},
			{
				value: "date",
				text: "DATA DE ENVIO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "status",
				text: "STATUS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
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
					width: "15%",
					justifyContent: "flex-end",
				},
			},
		]);

		const onSelectOptionAction = (event: string, item: IEvalu) => {
			const router = useRouter();
			id.value = item.id;
			typeAction.value = event;

			if (event === "approved") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja confirmar a aprovação para adoção?",
						description: "Após confirmação, você irá visualizá-lo na vitrine",
					},
					success: {
						title: "Aprovado com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "refused") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja reprovar para adoção?",
						description: "Após confirmação, o pet não pode ser adotado",
					},
					success: {
						title: "Reprovado com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "animal") {
				router.push({
					name: "animals-details",
					params: { id: item.animal.id },
				});
				return;
			}

			if (event === "protector") {
				router.push({
					name: "protectors-details",
					params: { id: item.tutor.id },
				});
			}
		};

		const optionsActions = [
			{ value: "protector", label: "Ver Protetor", icon: "check" },
			{ value: "animal", label: "Ver Pet", icon: "calendar" },
			{ value: "approved", label: "Aprovar", icon: "flag" },
			{ value: "refused", label: "Reprovar", icon: "x" },
		];

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				evaluationPetList.filters.status = null;
				evaluationPetList.fetchList(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				evaluationPetList.filters.status = trimmed;
				evaluationPetList.fetchList(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			evaluationPetList.filters.status = null;
			evaluationPetList.fetchList(1);
		};

		return {
			evaluationPetList,
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
					@on-input="onSearchInput"
					@clear-input="clearSearch"
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
						:text="item.tutor.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #nameAnimal>
					<AtomsTypography
						type="text-p5"
						:text="item.animal.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #species>
					<AtomsTypography
						type="text-p5"
						:text="item.animal.species.label"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #date>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.created_at).format('DD/MM/YYYY')"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						:color="getStatus(item.status)?.color"
						:text="getStatus(item.status)?.label || '---'"
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
			title="Nenhum animal para avaliação cadastrado"
			description="Aguarde até um animal ser cadastrado"
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="evaluationPetList.pagination"
				:total-items="evaluationPetList.pagination.total"
				:current-page="evaluationPetList.pagination.current_page"
				:per-page="evaluationPetList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
		<OrganismsOccurrencesEvaluationPetFilter
			:is-visible="isVisible"
			@clear-all="clearSearch"
			@close="isVisible = false"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
