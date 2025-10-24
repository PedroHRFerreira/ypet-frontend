<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useListStore } from "~/stores/animals/useListStore";

export default defineComponent({
	name: "TemplatesAnimalsList",
	setup() {
		const animalsList = useListStore();

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
						},
					},
				],
			};
		});

		onMounted(async () => {
			await animalsList.fetchAnimals();
		});

		return {
			header,
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
				<div v-if="animalsList.animals.length === 0" class="header-actions">
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
				<div class="main-content">
					<OrganismsAnimals />
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
