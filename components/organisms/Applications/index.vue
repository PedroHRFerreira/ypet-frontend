<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/applications/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";

export default defineComponent({
	name: "OrganismsApplications",
	components: {
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const applicationsList = useListStore();

		const header = computed(() => {
			return {
				title: "Todas as aplicações registradas",
				subtitle: "",
				buttons: [
					{
						text: "Novo cadastro",
						type: "primary",
						iconLeft: true,
						iconRight: false,
						nameIconLeft: "plus",
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.push({ name: "applications-create" });
						},
					},
				],
			};
		});

		const list = computed((): IApplication[] => {
			return applicationsList.applications;
		});

		async function paginationChange(value: number) {
			await applicationsList.fetchList({
				page: value,
				"with[]": ["animal", "product"],
			});
		}

		const columnsHeader = ref([
			{
				value: "product",
				text: "PRODUTO/INSUMO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%" },
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
				value: "application_date",
				text: "DATA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "10%", justifyContent: "flex-end" },
			},
			{
				value: "animal",
				text: "ANIMAL",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%", justifyContent: "flex-end" },
			},
		]);

		return {
			applicationsList,
			columnsHeader,
			header,
			list,
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
			<MoleculesListCardItem
				:data="columnsHeader as TypeColumn[]"
				padding="16px 0"
			>
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
				<template #product>
					<AtomsTypography
						type="text-p5"
						:text="String(item.product?.name)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #category>
					<AtomsTypography
						type="text-p5"
						:text="item.category?.label ?? item.category"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #application_date>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.application_date).format('DD/MM/YYYY')"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #animal>
					<AtomsTypography
						type="text-p5"
						:text="String(item.animal?.name)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="applicationsList.pagination"
				:total-items="applicationsList.pagination.total"
				:current-page="applicationsList.pagination.current_page"
				:per-page="applicationsList.pagination.per_page"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
