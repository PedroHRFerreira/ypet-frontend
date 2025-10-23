<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/report/useListStore";
import { useEditTypeStore } from "~/stores/report/useEditTypeStore";
export default defineComponent({
	name: "OrganismsOccurrencesAbuseReports",
	async setup() {
		const abuseReportList = useListStore();
		const abuseReportEditType = useEditTypeStore();
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
		await abuseReportList.fetchList();

		const list = computed((): ILostPet[] => {
			return abuseReportList.lostPet;
		});

		async function paginationChange(value: number) {
			await abuseReportList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{ value: "pending", name: "PENDING", label: "Perdido", color: "#e6a832" },
			{
				value: "confirmed",
				name: "CONFIRMED",
				label: "Encontrado",
				color: "#00b374",
			},
			{
				value: "completed",
				name: "COMPLETED",
				label: "Concluído",
				color: "#0055ff",
			},
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => {
			return {
				title: "Ocorrência de maus tratos",
				subtitle: "",
				buttons: [],
			};
		});

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (abuseReportEditType.isLoading) {
				return;
			}

			await abuseReportEditType.update(id.value, typeAction.value);

			if (abuseReportEditType.successMessage) {
				onSuccess();
			}

			await abuseReportList.fetchList();
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
				text: "Código",
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
				value: "Denunciante",
				text: "PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "Data e hora do envio",
				text: "LOCAL DA PERDA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "actions",
				text: "AÇÕES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
		]);

		const onSelectOptionAction = (event: string, item: IAdoption) => {
			const router = useRouter();
			id.value = item.id;
			typeAction.value = event;

			if (event === "confirm") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja confirmar a visita de adoção?",
						description: "Após confirmação, você irá visualizá-lo no painel",
					},
					success: {
						title: "Visita confirmada com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "complete") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja concluir visita?",
						description: "Após confirmação, você irá visualizá-lo no painel",
					},
					success: {
						title: "Visita concluída com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "cancel") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja cancelar visita?",
						description: "Após confirmação, você irá visualizá-lo no painel",
					},
					success: {
						title: "Visita cancelada om sucesso",
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

			if (event === "citizen") {
				router.push({ name: "citizens-edit", params: { id: item.citizen.id } });
			}

			if (event === "details") {
				router.push({
					name: "occurrences-adoption-details",
					params: { id: item.id },
				});
				return;
			}
		};

		const optionsActions = [
			{ value: "confirm", label: "Marcar como encontrado", icon: "check" },
			{ value: "complete", label: "Marcar como concluído", icon: "flag" },
			{ value: "details", label: "Ver detalhes", icon: "paw" },
			{ value: "details", label: "Ver último local", icon: "paw" },
		];

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				abuseReportList.filters.name = null;
				abuseReportList.fetchList(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				abuseReportList.filters.name = trimmed;
				abuseReportList.fetchList(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			abuseReportList.filters.name = null;
			abuseReportList.fetchList(1);
		};

		return {
			abuseReportList,
			columnsHeader,
			header,
			list,
			optionsActions,
			showConfirm,
			showSuccess,
			feedbackModal,
			confirmUpdate,
			continueFeedback,
			getStatus,
			onSelectOptionAction,
			paginationChange,
			isVisible,
			searchValue,
			onSearchInput,
			onSearchEnter,
			clearSearch,
			toggleDropdown,
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
				<template #nameUser>
					<AtomsTypography
						type="text-p5"
						:text="item.user.name"
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
				<template #locationLoss>
					<AtomsTypography
						type="text-p5"
						:text="item.start_date"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #dateLoss>
					<AtomsTypography
						type="text-p5"
						:text="item.visit_time"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						type="text"
						:color="getStatus(item.status)?.color"
						:size="'small'"
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
			title="Nenhuma denúncia encontrada"
			description="Tente ajustar seus filtros ou realize uma nova busca"
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="abuseReportList.pagination"
				:total-items="abuseReportList.pagination.total"
				:current-page="abuseReportList.pagination.current_page"
				:per-page="abuseReportList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
		<OrganismsOccurrencesAbuseReportsFilter
			:is-visible="isVisible"
			@close="isVisible = false"
			@clear-all="clearSearch"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
