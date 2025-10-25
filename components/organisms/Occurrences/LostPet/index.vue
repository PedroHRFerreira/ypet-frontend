<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/lost-pet/useListStore";
import { useEditTypeStore } from "~/stores/lost-pet/useEditTypeStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
import MoleculesModal from "~/components/molecules/Modal/index.vue";
export default defineComponent({
	name: "OrganismsOccurrencesLostPet",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
		MoleculesModal,
	},
	async setup() {
		const lostPetList = useListStore();
		const lostPetEditType = useEditTypeStore();
		const id = ref(0);
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const showModalLostAninamLocation = ref(false);
		const isVisible = ref(false);
		const searchValue = ref("");
		const address = ref("");
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
		await lostPetList.fetchList();

		const list = computed((): ILostPet[] => {
			return lostPetList.lostPet;
		});

		async function paginationChange(value: number) {
			await lostPetList.fetchList({ page: value });
		}

		const optionsStatus: IEnum[] = [
			{ value: "lost", name: "LOST", label: "Perdido", color: "warning" },
			{ value: "found", name: "FOUND", label: "Encontrado", color: "success" },
			{ value: "deceased", name: "DECEASED", label: "Óbito", color: "danger" },
			{
				value: "conclude",
				name: "CONCLUDE",
				label: "Concluído",
				color: "information",
			},
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		const header = computed(() => {
			return {
				title: "Lista de animais perdidos",
				subtitle: "",
				buttons: [],
			};
		});

		const mapUrl = computed(() => {
			if (!address.value) return "";
			return `https://www.google.com/maps?q=${encodeURIComponent(address.value)}&hl=pt&z=15&output=embed`;
		});

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmUpdate() {
			if (lostPetEditType.isLoading) {
				return;
			}

			await lostPetEditType.update(id.value, typeAction.value);

			if (lostPetEditType.successMessage) {
				onSuccess();
			}

			await lostPetList.fetchList();
			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
		}

		function onSuccess() {
			showSuccess.value = true;
		}

		function closeModalLostAnimalLocation() {
			showModalLostAninamLocation.value = false;
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
					width: "10%",
					justifyContent: "flex-end",
				},
			},
		]);

		const onSelectOptionAction = (event: string, item: ILostPet) => {
			const router = useRouter();
			id.value = item.id;
			typeAction.value = event;

			if (event === "found") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja confirmar como encontrado?",
						description: "",
					},
					success: {
						title: "Alteração realizada com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "conclude") {
				openConfirm();
				feedbackModal.value = {
					confirm: {
						title: "Deseja concluir?",
						description: "",
					},
					success: {
						title: "Concluído com sucesso",
						description: "",
					},
				};
				return;
			}

			if (event === "location" && item.address) {
				const addr = item.address;
				address.value = `${addr.street}, ${addr.number}${addr.complement ? ", " + addr.complement : ""}, ${addr.district}, ${addr.city}, ${addr.state}, ${addr.country}`;
				showModalLostAninamLocation.value = true;
			}

			if (event === "details") {
				router.push({
					name: "occurrences-lost-pet-details",
					params: { id: item.id },
				});
			}
		};

		const optionsActions = [
			{ value: "found", label: "Marcar como encontrado", icon: "check" },
			{ value: "conclude", label: "Marcar como concluído", icon: "flag" },
			{ value: "details", label: "Ver detalhes", icon: "flag" },
			{ value: "location", label: "Ver último local", icon: "paw" },
		];

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				lostPetList.filters.status = null;
				lostPetList.fetchList(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				lostPetList.filters.status = trimmed;
				lostPetList.fetchList(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			lostPetList.filters.status = null;
			lostPetList.fetchList(1);
		};

		return {
			lostPetList,
			columnsHeader,
			header,
			list,
			optionsActions,
			showConfirm,
			showSuccess,
			feedbackModal,
			isVisible,
			searchValue,
			showModalLostAninamLocation,
			mapUrl,
			closeModalLostAnimalLocation,
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
	<MoleculesModal
		:showModal="showModalLostAninamLocation"
		@close="closeModalLostAnimalLocation"
		width="559px"
		height=""
		type-modal="center"
		description="Última localização"
		title="Última localização do animal informado"
	>
		<section class="wrapper-modal">
			<iframe
				:src="mapUrl"
				width="100%"
				height="400"
				style="border: 0"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			>
			</iframe>
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
						:text="item.address.city"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #dateLoss>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.lost_at).format('DD/MM/YYYY')"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						:color="getStatus(item.status.status)?.color"
						:text="getStatus(item.status.status)?.label || '---'"
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
			title="Nenhum animal perdido"
			description="Aguarde até um animal ser cadastrado"
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="lostPetList.pagination"
				:total-items="lostPetList.pagination.total"
				:current-page="lostPetList.pagination.current_page"
				:per-page="lostPetList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
		<OrganismsOccurrencesLostPetFilter
			:is-visible="isVisible"
			@clear-all="clearSearch"
			@close="isVisible = false"
		/>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
