<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/abuse-report/useListStore";
import { useEditTypeStore } from "~/stores/abuse-report/useEditTypeStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
export default defineComponent({
	name: "OrganismsOccurrencesAbuseReports",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	async setup() {
		const abuseReportList = useListStore();
		const abuseReportEditType = useEditTypeStore();
		const id = ref(0);
		const showConfirm = ref(false);
		const showSuccess = ref(false);
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
				text: "TUTOR",
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
				value: "locationLoss",
				text: "LOCAL DA PERDA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "dateLoss",
				text: "DATA DA PERDA",
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
					width: "20%",
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
		<div class="wrapper-list-card__search"></div>
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
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="abuseReportList.pagination"
				:total-items="abuseReportList.pagination.total"
				:current-page="abuseReportList.pagination.current_page"
				:per-page="abuseReportList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
