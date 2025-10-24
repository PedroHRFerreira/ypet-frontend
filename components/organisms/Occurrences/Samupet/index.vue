<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/samupet/useListStore";
import { useEditTypeStore } from "~/stores/samupet/useEditTypeStore";

export default defineComponent({
	name: "OrganismsOccurrencesSamupet",
	async setup() {
		const samupetList = useListStore();
		const samupetEditType = useEditTypeStore();
		const id = ref(0);
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const isVisible = ref(false);
		const searchValue = ref("");
		const typeAction = ref("");
		const feedbackModal = ref({
			confirm: { title: "", description: "" },
			success: { title: "", description: "" },
		});

		await samupetList.fetchList();

		const list = computed(() => samupetList.samupet);

		async function paginationChange(value: number) {
			await samupetList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{ value: "open", name: "OPEN", label: "Aberto", color: "warning" },
			{
				value: "designated",
				name: "DESIGNATED",
				label: "Designado",
				color: "info",
			},
			{
				value: "in_attendance",
				name: "IN_ATTENDANCE",
				label: "Em Atendimento",
				color: "primary",
			},
			{
				value: "completed",
				name: "COMPLETED",
				label: "Concluído",
				color: "success",
			},
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => ({
			title: "Lista de ocorrências SamuPet",
			subtitle: "",
			buttons: [],
		}));

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (samupetEditType.isLoading) return;
			await samupetEditType.updateStatus(id.value, typeAction.value);

			if (samupetEditType.successMessage) onSuccess();

			await samupetList.fetchList();
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
				value: "requester",
				text: "SOLICITANTES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%", gap: "16px", wordBreak: "break-all" },
			},
			{
				value: "type",
				text: "TIPOS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "15%" },
			},
			{
				value: "location",
				text: "LOCALIZAÇÃO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "25%" },
			},
			{
				value: "date",
				text: "DATA E HORÁRIO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%", justifyContent: "flex-end" },
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

		const onSelectOptionAction = (event: string, item: any) => {
			const router = useRouter();
			id.value = item.id;
			typeAction.value = event;

			if (event === "received") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Marcar ocorrência como recebida?",
						description: "",
					},
					success: {
						title: "Ocorrência marcada como recebida",
						description: "",
					},
				};
				return;
			}

			if (event === "forwarded") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Marcar ocorrência como encaminhada?",
						description: "",
					},
					success: {
						title: "Ocorrência marcada como encaminhada",
						description: "",
					},
				};
				return;
			}

			if (event === "details") {
				router.push({
					name: "occurrences-id-report-details",
					params: { id: item.id },
				});
			}
		};

		const optionsActions = [
			{ value: "received", label: "Marcar como recebido", icon: "check" },
			{
				value: "forwarded",
				label: "Marcar como encaminhado",
				icon: "arrow-right",
			},
			{ value: "details", label: "Visualizar detalhes", icon: "eye" },
		];

		const toggleDropdown = () => (isVisible.value = true);

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				samupetList.filters.name = null;
				samupetList.fetchList(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				samupetList.filters.name = trimmed;
				samupetList.fetchList(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			samupetList.filters.name = null;
			samupetList.fetchList(1);
		};

		return {
			samupetList,
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

		<div v-if="list?.length > 0" class="wrapper-list-card__body">
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
				<template #requester>
					<AtomsTypography
						type="text-p5"
						:text="item.requester.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #type>
					<AtomsTypography
						type="text-p5"
						:text="item.type === 'dog' ? 'Cachorro' : 'Gato'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #location>
					<AtomsTypography
						type="text-p5"
						:text="item.location"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #date>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.created_at).format('DD/MM/YYYY HH:mm')"
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
			title="Nenhuma ocorrência SamuPet cadastrada"
			description="Aguarde até que uma nova ocorrência seja registrada"
		/>

		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="samupetList.pagination"
				:total-items="samupetList.pagination.total"
				:current-page="samupetList.pagination.current_page"
				:per-page="samupetList.pagination.per_page"
				@page-change="paginationChange($event)"
			/>
		</div>

		<OrganismsOccurrencesSamupetFilter
			:is-visible="isVisible"
			@clear-all="clearSearch"
			@close="isVisible = false"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
