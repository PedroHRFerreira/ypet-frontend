<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/animals/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";

export default defineComponent({
	name: "OrganismsAnimals",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const animalsList = useListStore();
		const isVisible = ref(false);
		const searchValue = ref("");

		const header = computed(() => {
			return {
				title: "Todos os animais cadastrados",
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
							router.push({ name: "animals-create" });
						},
					},
				],
			};
		});

		const list = computed((): IAnimal[] => {
			return animalsList.animals;
		});

		const columnsHeader = ref([
			{
				value: "registration_number",
				text: "INSCRIÇÃO",
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
				value: "entryDate",
				text: "ENTRADA",
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
				value: "name",
				text: "NOME",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
				},
			},
			{
				value: "typePet",
				text: "TIPO DE PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
				},
			},
			{
				value: "castrated",
				text: "CASTRADO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
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

		const onSelectOptionAction = (event: string, item: IAnimal) => {
			const router = useRouter();

			if (event === "details") {
				router.push({ name: "animals-details", params: { id: item.id } });

				return;
			}

			if (event === "edit") {
				router.push({ name: "animals-edit", params: { id: item.id } });
			}
		};

		const optionsStatus: IEnum[] = [
			{
				value: "for_adoption",
				name: "FOR_ADOPTION",
				label: "Para Adoção",
				color: "information",
			},
			{
				value: "with_owner",
				name: "WITH_OWNER",
				label: "Com Dono",
				color: "success",
			},
			{ value: "lost", name: "LOST", label: "Perdido", color: "warning" },
			{ value: "stolen", name: "STOLEN", label: "Roubado", color: "danger" },
			{ value: "deceased", name: "DECEASED", label: "Falecido", color: "dark" },
			{
				value: "targeted_adoption",
				name: "TARGETED_ADOPTION",
				label: "Adoção Direcionada",
				color: "primary",
			},
			{
				value: "restricted",
				name: "RESTRICTED",
				label: "Restrito",
				color: "secondary",
			},
			{
				value: "in_transfer",
				name: "IN_TRANSFER",
				label: "Em Transferência",
				color: "tertiary",
			},
			{
				value: "sheltered",
				name: "SHELTERED",
				label: "Abrigado",
				color: "success",
			},
		];

		const getStatus = (status: string | number) => {
			return (
				optionsStatus.find((s) => s.value === status) || {
					label: "Sem status",
					color: "secondary",
				}
			);
		};

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				animalsList.filters.name = null;
				animalsList.fetchAnimals();
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				animalsList.filters.name = trimmed;
				animalsList.fetchAnimals();
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			animalsList.filters.name = null;
			animalsList.fetchAnimals(1);
		};

		return {
			animalsList,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
			getStatus,
			isVisible,
			toggleDropdown,
			onSearchInput,
			onSearchEnter,
			clearSearch,
			searchValue,
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
					v-if="animalsList.animals.length > 0"
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
		<div class="wrapper-list-card__search">
			<div class="wrapper-list-card__search-input anim-loading">
				<MoleculesInputSearch
					label="Nome"
					:value="searchValue"
					:close="!!searchValue.trim().length"
					@on-input="onSearchInput"
					@clear-input="clearSearch"
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
				<template #registration_number>
					<AtomsTypography
						type="text-p5"
						:text="
							item.entry_data?.registration_number
								? `#${item.entry_data.registration_number}`
								: '---'
						"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #entryDate>
					<AtomsTypography
						type="text-p5"
						:text="$formatDate(item.created_at)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						:color="getStatus(item.status?.status.value)?.color"
						:text="getStatus(item.status?.status.value)?.label"
					/>
				</template>
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #typePet>
					<AtomsTypography
						type="text-p5"
						:text="item.species.label"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #castrated>
					<AtomsTypography
						type="text-p5"
						:text="$booleanToSimNao(item.entry_data?.castrated)"
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
		<MoleculesEmptyState
			v-else
			:is-icon="true"
			title="Nenhum animal cadastrado"
			description="Você ainda não possui nenhum animal cadastrado.Clique no botão 'Novo cadastro' para adicionar um."
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="animalsList.pagination"
				:total-items="animalsList.pagination.total"
				:current-page="animalsList.pagination.current_page"
				:per-page="animalsList.pagination.per_page"
			/>
		</div>
		<OrganismsAnimalsFilter
			:is-visible="isVisible"
			@close="isVisible = false"
			@clear-all="clearSearch"
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
