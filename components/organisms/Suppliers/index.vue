<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/suppliers/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";

export default defineComponent({
	name: "OrganismsSuppliers",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const suppliersList = useListStore();

		const header = computed(() => {
			return {
				title: "Todos os fornecedores cadastrados",
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
							router.push({ name: "suppliers-create" });
						},
					},
				],
			};
		});

		const list = computed((): ISupplier[] => {
			return suppliersList.suppliers;
		});

		async function paginationChange(value: number) {
			await suppliersList.fetchList({ page: value });
		}

		const columnsHeader = ref([
			{
				value: "legal_name",
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
				value: "document",
				text: "CNPJ",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
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
				},
			},
			{
				value: "representative",
				text: "REPRESENTANTE",
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

		const onSelectOptionAction = (event: string, item: ISupplier) => {
			const router = useRouter();

			if (event === "details") {
				router.push({ name: "suppliers-details", params: { id: item.uuid } });

				return;
			}

			if (event === "edit") {
				router.push({ name: "suppliers-edit", params: { id: item.uuid } });
			}
		};

		const optionsStatus: IEnum[] = [
			{
				value: 1,
				name: "ACTIVE",
				label: "Ativo",
				color: "#00b374",
			},
			{
				value: 2,
				name: "INACTIVE",
				label: "Inativo",
				color: "#999999",
			},
		];

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		return {
			suppliersList,
			columnsHeader,
			header,
			list,
			getStatus,
			onSelectOptionAction,
			paginationChange,
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
				<template #legal_name>
					<AtomsTypography
						type="text-p5"
						:text="item.legal_name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #document>
					<AtomsTypography
						type="text-p5"
						:text="useMaskDocument(item.document)"
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
				<template #representative>
					<AtomsTypography
						type="text-p5"
						:text="item.representative || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.uuid"
						:actions="[
							{ value: 'details', label: 'Detalhes', icon: 'info' },
							{ value: 'edit', label: 'Editar', icon: 'edit' },
						]"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="suppliersList.pagination"
				:total-items="suppliersList.pagination.total"
				:current-page="suppliersList.pagination.current_page"
				:per-page="suppliersList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
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
