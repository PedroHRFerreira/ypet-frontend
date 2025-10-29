<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useListStore } from "~/stores/castra-mobile/clinic-events/useListStore";

export default defineComponent({
	name: "OrganismsCastraMobileClinicEvent",
	setup() {
		const listStore = useListStore();
		const isVisible = ref(false);

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
				value: "name",
				text: "NOME",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "date",
				text: "DATA DE INICIO",
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

		onMounted(async () => {
			await listStore.fetchList();
		});

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		return {
			listStore,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
			isVisible,
			toggleDropdown,
		};
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

		<div class="wrapper-list-card__search-input anim-loading">
			<MoleculesButtonsCommon
				width="120px"
				type="outline"
				text="Filtros"
				size="small"
				icon-left
				name-icon-left="filter"
				@onclick="toggleDropdown"
			/>
		</div>

		<div v-if="list.length > 0" class="wrapper-list-card__body">
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
						:text="item.name || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #date>
					<AtomsTypography
						type="text-p5"
						:text="$formatDate(item.start_date) || '---'"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #location>
					<AtomsTypography
						type="text-p5"
						:text="item.location?.location_name || '---'"
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

		<MoleculesEmptyState
			v-else
			:is-icon="true"
			title="Nenhum evento cadastrado"
			description="Aqui voce pode visualizar e gerenciar os eventos cadastrados"
		/>

		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="listStore.pagination"
				:total-items="listStore.pagination.total"
				:current-page="listStore.pagination.current_page"
				:per-page="listStore.pagination.per_page"
			/>
		</div>
		<OrganismsCastraMobileClinicEventFilter
			:is-visible="isVisible"
			@close="isVisible = false"
		/>
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
