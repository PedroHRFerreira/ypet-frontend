<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import { useListStore } from "~/stores/castra-mobile/registrations/useListStore";

export default defineComponent({
	name: "OrganismsCastraMobileRegistrations",
	components: {
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const listStore = useListStore();

		const header = computed(() => {
			return {
				title: "Agenda do dia",
				subtitle: "",
				buttons: [
					{
						text: "Registar",
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
							router.push({ name: "castra-mobile.registrations.create" });
						},
					},
				],
			};
		});

		const list = computed((): IRegistration[] => {
			return listStore.list;
		});

		const columnsHeader = ref([
			{
				value: "id",
				text: "ID",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "5%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "hour",
				text: "DATA E HORA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "tutor",
				text: "TUTOR",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "pet",
				text: "PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "species",
				text: "ESPÉCIES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "weight",
				text: "PESO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
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

		const onSelectOptionAction = (event: string, item: IRegistration) => {
			const router = useRouter();

			if (event === "details") {
				router.push({
					name: "castra-mobile.registrations.details",
					params: { id: item.id },
				});
			}

			if (event === "pre_surgery_assessment") {
				router.push({
					path: `/castra-mobile/registrations/${item.animal_id}/pre-surgery-assessment`,
				});
			}

			if (event === "download_term") {
				listStore.downloadTerm(item.id);
			}
		};

		onMounted(async () => {
			await listStore.fetchList({
				"with[]": ["user", "animal"],
				"filter[date]": useDayjs().format("YYYY-MM-DD"),
			});
		});

		return {
			listStore,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
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
				<template #id>
					<AtomsTypography
						type="text-p5"
						:text="`#${item.id}`"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #hour>
					<AtomsTypography
						type="text-p5"
						:text="useDayjs(item.scheduler_at).format('DD/MM/YYYY - HH:mm')"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #tutor>
					<AtomsTypography
						type="text-p5"
						:text="item.user?.name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #pet>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #species>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.species.label || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #weight>
					<AtomsTypography
						type="text-p5"
						:text="item.animal?.weight ? `${item.animal.weight} kg` : '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsTypography
						type="text-p5"
						:text="item.status.label"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						:actions="[
							{ value: 'details', label: 'Detalhes' },
							{ value: 'pre_surgery_assessment', label: 'Triagem' },
							{ value: 'download_term', label: 'Baixar termo' },
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
