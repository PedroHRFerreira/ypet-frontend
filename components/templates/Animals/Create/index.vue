<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalsList } from "~/stores/animals/useAnimalsList";

export default defineComponent({
  name: "TemplatesAnimalsCreate",
  async setup() {
    const animalsList = useAnimalsList();

    await animalsList.fetchAnimals();

    return {
      animalsList,
    };
  },
  methods: {
    back() {
      const router = useRouter();
      router.push({ name: "animals" });
    }
  }
});
</script>

<template>
  <div class="animal-create">
    <div class="content">
      <div class="header">
        <div class="header-content">
          <AtomsTypography
            type="title-h7"
            class="header-content__title"
            text="Cadastro de animais"
            weight="medium"
            color="var(--brand-color-dark-blue-900)"
          />
          <AtomsTypography
            type="text-p4"
            class="header-content__subtitle"
            text="Visualize e gerencie os cadastros de animais"
            weight="medium"
            color="var(--brand-color-dark-blue-300)"
          />
        </div>
        <div class="header-actions">
          <MoleculesButtonsCommon
            type="primary"
            text="Voltar"
            @onclick="back"
          />
        </div>
      </div>
      <div class="main">
        <OrganismsAnimalsCreate />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
