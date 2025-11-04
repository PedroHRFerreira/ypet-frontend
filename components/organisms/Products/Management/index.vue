<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import MoleculesPaginationControls from "~/components/molecules/PaginationControls/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import MoleculesButtonsCommon from "~/components/molecules/Buttons/Common/Index.vue";
import type { ProductCategory } from "~/stores/products/useCreateStore";
import { useListStore as useProductsListStore } from "~/stores/products/useListStore";
import { useProductsCreateStore } from "~/stores/products/useCreateStore";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";
import MoleculesActionDropdown from "~/components/molecules/ActionDropdown/index.vue";

defineOptions({ name: "OrganismsProductsManagement" });

const productsList = useProductsListStore();
const createStore = useProductsCreateStore();
onMounted(async () => {
	await productsList.fetchList();
});

// Actions
const openCreateForm = () => {
	createStore.setCategory("vaccine");
	createStore.resetForm();
	const router = useRouter();
	router.push({ name: "products-create" });
};

// Define header item type to avoid generic casts
type ColumnHeader = {
	value: string;
	text: string;
	typeTypography: string;
	weightTypography: string;
	colorTypography: string;
	style: Record<string, string>;
};

// Columns
const columnsHeader = ref<ColumnHeader[]>([
	{
		value: "name",
		text: "NOME",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%", gap: "16px", wordBreak: "break-all" },
	},
	{
		value: "category",
		text: "CATEGORIA",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "manufacturer",
		text: "FABRICANTE",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "unit",
		text: "UNIDADE",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "stock",
		text: "ESTOQUE",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "validity",
		text: "VALIDADE",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "is_active",
		text: "STATUS",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
	{
		value: "actions",
		text: "AÇÕES",
		typeTypography: "text-p5",
		weightTypography: "bold",
		colorTypography: "var(--brand-color-dark-blue-300)",
		style: { width: "20%" },
	},
]);

const columnsData = computed(() =>
	columnsHeader.value.map((c) => ({ value: c.value, style: c.style })),
);
// List proxy
const list = computed((): IProduct[] => productsList.products);

// Pagination handlers
const onPageChange = async (page: number) => {
	productsList.setCurrentPage(page);
	await productsList.fetchList({ page });
};
const onPerPageChange = async (perPage: number) => {
	productsList.setPerPage(perPage);
	productsList.setCurrentPage(1);
	await productsList.fetchList({ page: 1 });
};

// Actions
const onEdit = (p: IProduct) => {
	// hydrate form from product
	Object.keys(createStore.form).forEach((key) => {
		// @ts-ignore
		createStore.form[key].value = (p as any)[key] ?? null;
	});
	const cat = String(p.category || "medication") as ProductCategory;
	createStore.setCategory(cat);

	const router = useRouter();
	router.push({ name: "products-edit", params: { id: p.id } });
};

// Removed onInactivate as actions no longer inactivate from list
const headerTitle = "Todos os produtos e insumos cadastrados";

const optionsStatus = [
	{ value: true, label: "Ativo", color: "#00b374" },
	{ value: false, label: "Inativo", color: "#999999" },
];
const getStatus = (status: boolean | number | string) => {
	if (typeof status === "string")
		return optionsStatus.find((s) => String(s.value) === status);
	return optionsStatus.find((s) => s.value === !!status);
};

const onSelectOptionAction = (event: string, item: IProduct) => {
	if (event === "edit") onEdit(item);
};
</script>

<template>
	<section class="wrapper-list-card">
		<div class="wrapper-list-card__header">
			<div class="wrapper-list-card__header-title">
				<AtomsTypography
					type="title-h7"
					:text="headerTitle"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
			<div class="wrapper-list-card__header-actions">
				<MoleculesButtonsCommon
					type="primary"
					text="Novo cadastro"
					:icon-left="true"
					:name-icon-left="'plus'"
					:size="'small'"
					width="auto"
					@onclick="openCreateForm"
				/>
			</div>
		</div>

		<div class="wrapper-list-card__search"></div>

		<div class="wrapper-list-card__body">
			<MoleculesListCardItem :data="columnsData" padding="16px 0">
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
				:data="columnsData"
				padding="0"
			>
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #category>
					<AtomsTypography
						type="text-p5"
						:text="
							(item.category as any)?.label ||
							(item.category as string) ||
							'---'
						"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #manufacturer>
					<AtomsTypography
						type="text-p5"
						:text="item.manufacturer || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #unit>
					<AtomsTypography
						type="text-p5"
						:text="(item.unit as any)?.label || (item.unit as string) || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #stock>
					<AtomsTypography
						type="text-p5"
						:text="String(item.stock ?? 0)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #validity>
					<AtomsTypography
						type="text-p5"
						:text="item.validity || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #is_active>
					<AtomsBadges
						type="text"
						:color="getStatus(!!item.is_active)?.color"
						:size="'small'"
						:text="getStatus(!!item.is_active)?.label || '---'"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						:actions="[{ value: 'edit', label: 'Editar' }]"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>

		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="productsList.pagination"
				:total-items="productsList.pagination.total"
				:current-page="productsList.pagination.current_page"
				:per-page="productsList.pagination.per_page"
				@pageChange="onPageChange"
				@perPageChange="onPerPageChange"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
