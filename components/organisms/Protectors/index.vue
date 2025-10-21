<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/protectors/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";

export default defineComponent({
	name: "OrganismsProtectors",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const protectorsList = useListStore();

		const header = computed(() => {
			return {
				title: "Todos os protetores cadastrados",
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
							router.push({ name: "protectors-create" });
						},
					},
				],
			};
		});

		const list = computed((): IProtectors[] => {
			return protectorsList.protectors;
		});

		async function paginationChange(value: number) {
			await protectorsList.fetchList({ page: value });
		}

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
				value: "document",
				text: "CPF",
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
				value: "telephone",
				text: "TELEFONE",
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

		const onSelectOptionAction = (event: string, item: IProtectors) => {
			const router = useRouter();

			if (event === "details") {
				router.push({ name: "protectors-details", params: { id: item.id } });
				return;
			}

			if (event === "edit") {
				router.push({ name: "protectors-edit", params: { id: item.id } });
			}
		};

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

		const getStatus = (status: string | number) => {
			return optionsStatus.find((s) => s.value === status);
		};

		return {
			protectorsList,
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
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.user.name"
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
						:color="getStatus(item.status)?.color"
						:text="getStatus(item.status)?.label || '---'"
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
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="protectorsList.pagination"
				:total-items="protectorsList.pagination.total"
				:current-page="protectorsList.pagination.current_page"
				:per-page="protectorsList.pagination.per_page"
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
