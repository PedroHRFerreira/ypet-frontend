<script lang="ts">
import { type ConcreteComponent, defineComponent } from "vue";
import { useAnimalsList } from "~/stores/animals/useAnimalsList";

export default defineComponent({
	name: "TemplatesAnimalsList",
	async setup() {
		const animalsList = useAnimalsList();

		await animalsList.fetchAnimals();

    const header = computed(() => {
      return {
        title: "Cadastro de animais",
        subtitle: "Visualize e gerencie os cadastros de animais",
        buttons: [
          {
            text: "Novo cadastro",
            type: "primary",
            icon: "plus",
            iconLeft: false,
            nameIconLeft: "",
            iconRight: true,
            nameIconRight: "plus",
            action: () => {
              const router = useRouter();
              router.push({ name: "animals-create" });
            }
          }
        ]
      };
    });

    const emptyState = computed(() => {
      return {
        isEmpty: animalsList.animals.length === 0,
        isIcon: true,
        title: "Nenhum animal cadastrado",
        description:
          "Você ainda não possui nenhum animal cadastrado.Clique no botão 'Novo cadastro' para adicionar um.",
      };
    });

		return {
      header,
      emptyState,
			animalsList,
		};
	},
});
</script>

<template>
	<div class="animal-list">
		<div class="content">
			<header class="header">
				<div class="header-content">
					<AtomsTypography
						type="title-h7"
						class="header-content__title"
						:text="header.title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsTypography
						type="text-p4"
						class="header-content__subtitle"
						:text="header.subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
				</div>
				<div class="header-actions">
          <MoleculesButtonsCommon
            v-for="button in header.buttons"
            :key="button.text"
            :type="button.type"
            :text="button.text"
            :icon-left="button.iconLeft"
            :icon-right="button.iconRight"
            :name-icon-left="button.nameIconLeft"
            :name-icon-right="button.nameIconRight"
            @onclick="button.action"
          />
				</div>
			</header>
			<main class="main">
				<div v-if="emptyState.isEmpty" class="main-empty">
					<MoleculesEmptyState
						:is-icon="emptyState.isIcon"
						:title="emptyState.title"
						:description="emptyState.description"
					/>
				</div>
				<div v-else class="main-content">
					<OrganismsAnimals />
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
