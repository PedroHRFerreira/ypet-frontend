<script lang="ts">
import { defineComponent } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";

export default defineComponent({
	name: "OrganismsLocations",
	setup() {
		const locationsStore = useLocationsStore();
		const isVisible = ref(false);
		const searchValue = ref("");
		const router = useRouter();

		const header = computed(() => ({
			title: "Todos os locais cadastrados",
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
						router.push({ name: "locations-create" });
					},
				},
			],
		}));

		const columnsHeader = ref([
			{
				value: "name",
				text: "NOME",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "25%" },
			},
			{
				value: "type",
				text: "TIPO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "20%" },
			},
			{
				value: "status",
				text: "STATUS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: { width: "25%" },
			},
			{
				value: "phone",
				text: "TELEFONE",
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
				style: { width: "15%", justifyContent: "flex-end" },
			},
		]);

		const list = computed(() => locationsStore.locations);
		const pagination = computed(() => locationsStore.meta);
		const isLoading = computed(() => locationsStore.isLoading);

		const dropdownOptions = computed(() => [
			{ label: "Editar", value: "edit" },
			{ label: "Detalhes", value: "details" },
		]);

		const onSelectOptionAction = (event: string, item: ICitizens) => {
			const router = useRouter();

			if (event === "edit") {
				router.push({ name: "locations-edit", params: { id: item.id } });
			}

			if (event === "details") {
				router.push({ name: "locations-details", params: { id: item.id } });
			}
		};

		const paginationChange = (page: number) => {
			locationsStore.changePage(page);
		};

		const toggleDropdown = () => {
			isVisible.value = true;
		};

		const onSearchInput = (value: string) => {
			searchValue.value = value;
			if (searchValue.value.trim().length === 0) {
				locationsStore.filters.name = null;
				locationsStore.fetchLocations(1);
			}
		};

		const onSearchEnter = () => {
			const trimmed = searchValue.value.trim();
			if (trimmed.length > 0) {
				locationsStore.filters.name = trimmed;
				locationsStore.fetchLocations(1);
			}
		};

		const clearSearch = () => {
			searchValue.value = "";
			locationsStore.filters.name = null;
			locationsStore.fetchLocations(1);
		};

		const LocationTypeEnum: Record<string, string> = {
			pet_hotel: "Hotel Pet",
			temporary_home: "Lar Temporário",
			municipal_temporary_shelter: "Abrigo Temporário Municipal",
			partner_clinics: "Clínicas Conveniadas",
			veterinary_hospital: "Hospital Veterinário",
			adopt_here: "Adote Aqui",
			shelter_protector: "Abrigo / Protetor",
		};

		const LocationStatusEnum: Record<number, string> = {
			0: "Inativo",
			1: "Ativo",
		};

		const getLocationStatusText = (statusId: number) => {
			return LocationStatusEnum[statusId] || statusId;
		};

		const getLocationTypeText = (typeId: string) => {
			return LocationTypeEnum[typeId] || typeId;
		};

		return {
			locationsStore,
			header,
			columnsHeader,
			list,
			pagination,
			isLoading,
			dropdownOptions,
			onSelectOptionAction,
			paginationChange,
			toggleDropdown,
			isVisible,
			onSearchInput,
			onSearchEnter,
			clearSearch,
			searchValue,
			getLocationStatusText,
			getLocationTypeText,
		};
	},
});
</script>

<template>
	<section class="wrapper-list-card" :class="{ loading: isLoading }">
		<div class="wrapper-list-card__header">
			<div class="wrapper-list-card__header-title anim-loading">
				<AtomsTypography
					type="title-h7"
					:text="header.title"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
			<div class="wrapper-list-card__header-actions anim-loading">
				<MoleculesButtonsCommon
					v-if="locationsStore.locations.length > 0"
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
		<div v-if="locationsStore.locations.length > 0">
			<MoleculesListCardItem :data="columnsHeader" padding="24px 32px">
				<template
					v-for="(item, key) in columnsHeader"
					#[item.value]
					:key="key"
					class="anim-loading"
				>
					<AtomsTypography
						:type="item.typeTypography"
						:text="item.text"
						:weight="item.weightTypography"
						:color="item.colorTypography"
					/>
				</template>
			</MoleculesListCardItem>

			<MoleculesListCardItem
				v-for="item in list"
				:key="item.id"
				:data="columnsHeader"
				padding="32px"
				class="anim-loading"
			>
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.location_name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #type>
					<AtomsTypography
						type="text-p5"
						:text="getLocationTypeText(item.location_type)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>

				<template #status>
					<AtomsTypography
						type="text-p5"
						:text="getLocationStatusText(item.status)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #phone>
					<AtomsTypography
						type="text-p5"
						:text="usePhoneFormatter11BR(String(item.phone))"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						:actions="dropdownOptions"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>

		<MoleculesEmptyState
			v-else
			:is-icon="true"
			title="Nenhum local cadastrado"
			description="Adicione um novo cadastro para começar."
		/>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="pagination"
				:total-items="pagination?.data.total || 0"
				:current-page="pagination?.data.current_page || 1"
				:per-page="pagination?.data.per_page || 10"
				@pageChange="paginationChange($event)"
			/>
		</div>
	</section>
	<OrganismsLocationsFilter
		:is-visible="isVisible"
		@clear-all="clearSearch"
		@close="isVisible = false"
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
