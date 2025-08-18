<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalsList } from "~/stores/animals/useAnimalsList";

export default defineComponent({
	name: "TemplatesAnimalsList",
	async setup() {
		const animalsList = useAnimalsList();

		await animalsList.fetchAnimals();

		return {
			animalsList,
		};
	},
	computed: {
		emptyState() {
			return {
				isEmpty: true || this.animalsList.animals.length === 0,
				isIcon: true,
				title: "Nenhum animal cadastrado",
				description:
					"Você ainda não possui nenhum animal cadastrado.Clique no botão 'Novo cadastro' para adicionar um.",
			};
		},
	},
	methods: {
		handleNewRegistration() {
			const router = useRouter();
			router.push({ name: "animals-create" });
		},
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
						text="Novo cadastro"
						@onclick="handleNewRegistration"
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
