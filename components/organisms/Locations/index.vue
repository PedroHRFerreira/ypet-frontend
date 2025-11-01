<script lang="ts">
import { defineComponent } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";
import { useDeleteStore as useLocationsDeleteStore } from "~/stores/locations/useDeleteStore";

export default defineComponent({
  name: "OrganismsLocations",
  setup() {
    const locationsStore = useLocationsStore();
    const deleteStore = useLocationsDeleteStore();
    const isVisible = ref(false);
    const searchValue = ref("");
    const router = useRouter();
    const showConfirm = ref(false);
    const showSuccess = ref(false);
    const selectedId = ref<number | null>(null);

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
        style: { width: "10%" },
      },
      {
        value: "phone",
        text: "TELEFONE",
        typeTypography: "text-p5",
        weightTypography: "bold",
        colorTypography: "var(--brand-color-dark-blue-300)",
        style: { width: "25%" },
      },
      {
        value: "actions",
        text: "AÇÕES",
        typeTypography: "text-p5",
        weightTypography: "bold",
        colorTypography: "var(--brand-color-dark-blue-300)",
        style: { width: "20%", justifyContent: "flex-end" },
      },
    ]);

    const list = computed(() => locationsStore.locations);
    const pagination = computed(() => locationsStore.meta);
    const isLoading = computed(() => locationsStore.isLoading);

    const dropdownOptions = computed(() => [
      { label: "Editar", value: "edit" },
      { label: "Detalhes", value: "details" },
      { label: "Excluir", value: "delete" },
    ]);

    const onSelectOptionAction = (event: string, item: ILocation) => {
      const router = useRouter();

      if (event === "edit") {
        router.push({ name: "locations-edit", params: { id: item.id } });
      }

      if (event === "details") {
        router.push({ name: "locations-details", params: { id: item.id } });
      }

      if (event === "delete") {
        selectedId.value = Number(item.id);
        showConfirm.value = true;
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

    const optionsLocationType: IEnum[] = [
      {
        value: "pet_hotel",
        name: "PET_HOTEL",
        label: "Hotel Pet",
        color: "information",
      },
      {
        value: "temporary_home",
        name: "TEMPORARY_HOME",
        label: "Lar Temporário",
        color: "warning",
      },
      {
        value: "municipal_temporary_shelter",
        name: "MUNICIPAL_TEMPORARY_SHELTER",
        label: "Abrigo Temporário Municipal",
        color: "secondary",
      },
      {
        value: "partner_clinics",
        name: "PARTNER_CLINICS",
        label: "Clínicas Conveniadas",
        color: "tertiary",
      },
      {
        value: "veterinary_hospital",
        name: "VETERINARY_HOSPITAL",
        label: "Hospital Veterinário",
        color: "success",
      },
      {
        value: "adopt_here",
        name: "ADOPT_HERE",
        label: "Adote Aqui",
        color: "primary",
      },
      {
        value: "shelter_protector",
        name: "SHELTER_PROTECTOR",
        label: "Abrigo / Protetor",
        color: "warning",
      },
    ];

    const optionsStatus: IEnum[] = [
      { value: 1, name: "ACTIVE", label: "Ativo", color: "success" },
      {
        value: 0,
        name: "INACTIVE",
        label: "Inativo",
        color: "secondary",
      },
      {
        value: 2,
        name: "SUSPENDED",
        label: "Suspenso",
        color: "warning",
      },
      { value: 3, name: "DELETED", label: "Deletado", color: "danger" },
    ];

    const getStatus = (status: string | number) => {
      return optionsStatus.find((s) => s.value === status);
    };

    const getLocationType = (type: string) => {
      return optionsLocationType.find((t) => t.value === type);
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
      getStatus,
      getLocationType,
      // delete
      deleteStore,
      showConfirm,
      showSuccess,
      selectedId,
      async confirmDelete() {
        if (!selectedId.value) return;
        await deleteStore.destroy(selectedId.value);
        if (!deleteStore.errorMessage) {
          showSuccess.value = true;
          await locationsStore.fetchLocations(locationsStore.meta.current_page || 1);
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
      <MoleculesListCardItem :data="columnsHeader" padding="16px 32px">
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
        padding="8px 32px"
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
          <AtomsBadges
            :color="getLocationType(item.location_type)?.color"
            :text="getLocationType(item.location_type)?.label || 'Sem tipo'"
          />
        </template>

        <template #status>
          <AtomsBadges
            :color="getStatus(item.status)?.color"
            :text="getStatus(item.status)?.label || 'Sem status'"
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
  <MoleculesConfirmFeedbackModal
    v-model:open="showConfirm"
    variant="confirm"
    title="Excluir local"
    description="Tem certeza que deseja excluir este local? Esta ação não pode ser desfeita."
    confirm-text="Excluir"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
    @close="onCloseConfirm"
  />
  <MoleculesConfirmFeedbackModal
    v-model:open="showSuccess"
    variant="success"
    title="Local excluído com sucesso"
    continue-text="Fechar"
    @close="onCloseSuccess"
  />
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
