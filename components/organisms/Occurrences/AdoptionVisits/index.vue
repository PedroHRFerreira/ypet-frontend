<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/adoption/useListStore";
import { useEditTypeStore } from "~/stores/adoption/useEditTypeStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
import AtomsDatePicker from "~/components/atoms/DatePicker/Index.vue";
import MoleculesModal from "~/components/molecules/Modal/index.vue";
export default defineComponent({
	name: "OrganismsOccurrencesAdoptionVisits",
	components: {
		AtomsBadges,
		AtomsDatePicker,
		AtomsTypography,
		MoleculesListCardItem,
		MoleculesModal
	},
	async setup() {
		const adoptionList = useListStore();
		const adoptionEditType = useEditTypeStore();
		const id = ref(0);
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const typeAction = ref("");
		const showModalReschedule = ref(false);
		const feedbackModal = ref({
			confirm:{
				title:"",
				description:""
			},
			success:{
				title:"",
				description:""
			}
		});
		await adoptionList.fetchList();

		const list = computed((): IAdoption[] => {
			return adoptionList.adoption;
		});

		async function paginationChange(value: number) {
			await adoptionList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{ value: 'pending', name: "PENDING", label: "Pendente", color: "#e6a832" },
			{ value: 'confirmed', name: "CONFIRMED", label: "Confirmado", color: "#00b374" },
			{ value: 'rescheduled', name: "RESCHEDULED", label: "Remarcado", color: "#f0a500" },
			{ value: 'completed', name: "COMPLETED", label: "Concluído", color: "#0055ff" },
			{ value: 'canceled', name: "CANCELED", label: "Cancelado", color: "#cc3333" },
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => {
			return {
				title: "Lista de visitas de adoção",
				subtitle: "",
				buttons: [],
			};
		});

	
		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (adoptionEditType.isLoading) {
				return;
			}

			await adoptionEditType.update(id.value, typeAction.value);

			if (adoptionEditType.successMessage) {
				onSuccess();
			}
			
			await adoptionList.fetchList();
			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
		}


		function onSuccess() {
			showSuccess.value = true;
		}

		function closeModalReschedule() {
			showModalReschedule.value = false
		}

		const columnsHeader = ref([
			{
				value: "nameUser",
				text: "CIDADÃO",
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
				text: "ANIMAL",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "dateVisit",
				text: "DATA VISITA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "timeVisit",
				text: "HORA VISITA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "telephone",
				text: "CONTATO",
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
			id.value =  item.id;
			typeAction.value = event;

			if (event === "confirm") {
				openConfirm();
				feedbackModal.value = {
					confirm:{
						title:"Deseja confirmar a visita de adoção?",
						description:"Após confirmação, você irá visualizá-lo no painel"
					},
					success:{
						title:"Visita confirmada com sucesso",
						description:""
					}
				}
				return;
			}

			if (event === "reschedule") {
				showModalReschedule.value = true
				return;
			}

			if (event === "complete") {
				openConfirm();
				feedbackModal.value = {
					confirm:{
						title:"Deseja concluir visita?",
						description:"Após confirmação, você irá visualizá-lo no painel"
					},
					success:{
						title:"Visita concluída com sucesso",
						description:""
					}
				}
				return;
			}

			if (event === "cancel") {
				openConfirm();
				feedbackModal.value = {
					confirm:{
						title:"Deseja cancelar visita?",
						description:"Após confirmação, você irá visualizá-lo no painel"
					},
					success:{
						title:"Visita cancelada om sucesso",
						description:""
					}
				}
				return;
			}

			if (event === "animal") {
				router.push({ name: "animals-details", params: { id: item.animal.id } });
				return;
			}

			if (event === "citizen") {
				router.push({ name: "citizens-edit", params: { id: item.citizen.id } });
			}

			if (event === "details") {
				router.push({ name: "occurrences-adoption-details", params: { id: item.id } });
				return;
			}
		};

		const optionsActions = [
			{ value: "confirm", label: "Confirmar visita", icon: "check" },
			{ value: "reschedule", label: "Remarcar", icon: "calendar" },
			{ value: "complete", label: "Concluir", icon: "flag" },
			{ value: "cancel", label: "Cancelar", icon: "x" },
			{ value: "animal", label: "Ver animal", icon: "paw" },
			{ value: "citizen", label: "Ver cidadão", icon: "user" },
			{ value: "details", label: "Ver detalhes", icon: "paw" },
		];

		return {
			adoptionList,
			columnsHeader,
			header,
			list,
			optionsActions,
			showConfirm,
			showSuccess,
			feedbackModal,
			showModalReschedule,
			confirmUpdate,
			closeModalReschedule,
			continueFeedback,
			getStatus,
			onSelectOptionAction,
			paginationChange,
		};
	}
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

	<MoleculesModal
		:showModal="showModalReschedule"
		@close="closeModalReschedule"
		width="559px"
		height=""
		type-modal="center"
		description="Selecione uma data e horário para a visita (novo texto)"
	>	
		<section class="wrapper-modal">
			<div class="wrapper-modal__icon">
				<AtomsIconsCalendar/>
			</div>
			<div class="wrapper-modal__title">
				<AtomsTypography
					type="text-p1"
					text="Escolha uma nova data e horário"
					weight="bold"
					color="var(--brand-color-dark-blue-300)"
				/>
				<AtomsTypography
					type="text-p3"
					text="Selecione uma data e horário para a visita"
					weight="regular"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
			<div class="wrapper-calendar">
				<AtomsDatePicker
					inline
					border="none"
				/>
				<div class="wrapper-calendar__time">
					<MoleculesInputCommon
						type-input="time"
						label="Horário da visita"
						max-width="100%"
					/>
				</div>
			</div>
			<div class="confirm-button">
				<MoleculesButtonsCommon
					text="Atualizar data e horário"
					type="primary"
					size="small"
					width="200px"
				/>
			</div>
		</section>
	</MoleculesModal>

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
				<template #dateVisit>
					<AtomsTypography
						type="text-p5"
						:text="item.start_date"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #timeVisit>
					<AtomsTypography
						type="text-p5"
						:text="item.visit_time"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #telephone>
					<AtomsTypography
						type="text-p5"
						:text="usePhoneFormatter11BR(item.user.telephone)"
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
				v-if="adoptionList.pagination"
				:total-items="adoptionList.pagination.total"
				:current-page="adoptionList.pagination.current_page"
				:per-page="adoptionList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
