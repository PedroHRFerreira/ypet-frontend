<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useListStore } from "~/stores/collaborators/useListStore";
import { useDeleteStore as useCollaboratorsDeleteStore } from "~/stores/collaborators/useDeleteStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";

export default defineComponent({
	name: "OrganismsCollaborators",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const listStore = useListStore();
		const deleteStore = useCollaboratorsDeleteStore();
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const selectedId = ref<number | null>(null);

		const header = computed(() => {
			return {
				title: "Todos os cadastrados",
				subtitle: "",
				buttons: [
					{
						text: "Novo cadastro",
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
							router.push({ name: "collaborators-create" });
						},
					},
				],
			};
		});

		const list = computed((): ICollaborator[] => {
			return listStore.list;
		});

		const columnsHeader = ref([
			{
				value: "name",
				text: "NOME",
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
				value: "email",
				text: "E-MAIL",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
				},
			},
			{
				value: "role",
				text: "FUNÇÃO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
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
				value: "created_at",
				text: "DATA DE CRIAÇÃO",
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

		const onSelectOptionAction = (event: string, item: ICollaborator) => {
			const router = useRouter();

			if (event === "details") {
				router.push({ name: "collaborators-details", params: { id: item.id } });

				return;
			}

			if (event === "edit") {
				router.push({ name: "collaborators-edit", params: { id: item.id } });
			}

			if (event === "delete") {
				selectedId.value = Number(item.id);
				showConfirm.value = true;
			}
		};

		onMounted(async () => {
			await listStore.fetchList();
		});

		const optionsStatus: IEnum[] = [
			{ value: "active", name: "ACTIVE", label: "Ativo", color: "success" },
			{
				value: "inactive",
				name: "INACTIVE",
				label: "Inativo",
				color: "secondary",
			},
			{
				value: "suspended",
				name: "SUSPENDED",
				label: "Suspenso",
				color: "warning",
			},
			{ value: "deleted", name: "DELETED", label: "Deletado", color: "danger" },
		];

		const optionsRoles: IEnum[] = [
			{
				value: "manager_administrator",
				name: "MANAGER_ADMINISTRATOR",
				label: "Administrador",
				color: "success",
			},
			{
				value: "user_agent",
				name: "USER_AGENT",
				label: "Agente",
				color: "information",
			},
		];
		const getRole = (roleValue: string): IEnum => {
			return (
				optionsRoles.find((r) => r.value === roleValue) || {
					value: "",
					name: "",
					label: roleValue || "N/A",
					color: "secondary",
				}
			);
		};

		const getStatus = (status: string | undefined): IEnum => {
			return (
				optionsStatus.find((s) => s.value === status) || {
					value: "",
					name: "",
					label: "Sem status",
					color: "secondary",
				}
			);
		};

		return {
			listStore,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
			getStatus,
			getRole,
			deleteStore,
			showConfirm,
			showSuccess,
			selectedId,
			async confirmDelete() {
				if (!selectedId.value) return;
				await deleteStore.destroy(selectedId.value);
				if (!deleteStore.errorMessage) {
					showSuccess.value = true;
					await listStore.fetchList({ page: listStore.pagination?.current_page || 1 });
				}
			},
			onCloseConfirm() {
				showConfirm.value = false;
			},
			onCloseSuccess() {
				showSuccess.value = false;
			},
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
			<div class="wrapper-list-card__header-actions">
				<MoleculesButtonsCommon
					v-for="button in header.buttons"
					:key="button.text"
					:type="button.type"
					:text="button.text"
					:icon-left="button.iconLeft"
					:icon-right="button.iconRight"
					:name-icon-left="button.nameIconLeft"
					:name-icon-right="button.nameIconRight"
					:size="button.size"
					:width="button.width"
					@onclick="button.action"
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
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.user.name || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #email>
					<AtomsTypography
						type="text-p5"
						:text="item.user.email || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #role>
					<AtomsBadges
						:text="
							getRole(
								item.user.roles?.length
									? item.user.roles.map((role) => role.name).join(', ')
									: 'N/A',
							).label
						"
						:color="
							getRole(
								item.user.roles?.length
									? item.user.roles.map((role) => role.name).join(', ')
									: 'N/A',
							).color
						"
					/>
				</template>
				<template #status>
					<AtomsBadges
						v-if="item.user.status?.status"
						:text="
							getStatus(item.user.status.status.value)?.label || 'Sem status'
						"
						:color="
							getStatus(item.user.status.status.value)?.color || 'secondary'
						"
					/>
				</template>
				<template #created_at>
					<AtomsTypography
						type="text-p5"
						:text="$formatDate(item.created_at)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						:actions="[
							{ label: 'Ver detalhes', value: 'details' },
							{ label: 'Editar', value: 'edit' },
							{ label: 'Excluir', value: 'delete' },
						]"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="listStore.pagination"
				:total-items="listStore.pagination.total"
				:current-page="listStore.pagination.current_page"
				:per-page="listStore.pagination.per_page"
			/>
		</div>
	</section>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Excluir colaborador"
		description="Tem certeza que deseja excluir este colaborador?"
		confirm-text="Excluir"
		cancel-text="Cancelar"
		@confirm="confirmDelete"
		@close="onCloseConfirm"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Colaborador excluído com sucesso"
		continue-text="Fechar"
		@close="onCloseSuccess"
	/>
</template>

<style scoped lang="scss">
@use "styles.module";

.header__container--item {
	position: relative;
	cursor: pointer;

	&__select {
		padding: 8px;
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: var(--brand-color-white);
		color: var(--brand-color-dark-blue-300);
		font-size: 14px;
		font-weight: 500;
		transition:
			background-color 0.3s,
			color 0.3s;

		&:hover {
			background-color: var(--brand-color-dark-blue-100);
			color: var(--brand-color-dark-blue-900);
		}
	}

	&__dropdown {
		position: absolute;
		top: 110%;
		right: 0;
		background-color: var(--white);
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 150px;
	}
}
</style>
