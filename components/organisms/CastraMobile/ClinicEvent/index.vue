<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import { useListStore } from "~/stores/castra-mobile/clinic-events/useListStore";

export default defineComponent({
	name: "OrganismsCastraMobileClinicEvent",
	components: {
		AtomsTypography,
		MoleculesListCardItem,
	},
	async setup() {
		const listStore = useListStore();
		await listStore.fetchList();
		const header = computed(() => {
			return {
				title: "Eventos clínicos",
				subtitle: "Gerencie os eventos clínicos aqui",
				buttons: [
					{
						text: "Cadastrar",
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
							router.push({ name: "clinic-events-create" });
						},
					},
				],
			};
		});

		const list = computed((): IMobileClinicEvent[] => {
			return listStore.list;
		});

		const columnsHeader = ref([
			{
				value: "date",
				text: "DATA",
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
				value: "location",
				text: "LOCAL",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "max_registrations",
				text: "Nº. DE VAGAS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "current_registrations",
				text: "INSCRIÇÕES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
				},
			},
			{
				value: "species",
				text: "ESPÉCIES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "gender",
				text: "SEXO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "situation",
				text: "SITUAÇÃO",
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

		const onSelectOptionAction = (event: string, item: IMobileClinicEvent) => {
			const router = useRouter();

			if (event === "details") {
				router.push({
					name: "clinic-event-details",
					params: { id: item.id },
				});
			}

			if (event === "edit") {
				router.push({
					name: "clinic-events-edit",
					params: { id: item.id },
				});
			}
		};

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
				<template #date>
					<AtomsTypography
						type="text-p5"
						:text="
							item.start_date && item.end_date
								? `${item.start_date} - ${item.start_date}`
								: '---'
						"
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
				<template #max_registrations>
					<AtomsTypography
						type="text-p5"
						:text="item.max_registrations?.toString() || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #current_registrations>
					<AtomsTypography
						type="text-p5"
						:text="item.current_registrations?.toString() || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #species>
					<AtomsTypography
						type="text-p5"
						:text="item.species?.label || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #gender>
					<AtomsTypography
						type="text-p5"
						:text="item.gender?.label || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #situation>
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
							{ value: 'edit', label: 'Editar' },
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
