<script lang="ts">
import { defineComponent } from "vue";
import { useListStore } from "~/stores/citizens/useListStore";

export default defineComponent({
	name: "TemplatesCitizens",
	async setup() {
		const citizensList = useListStore();

		await citizensList.fetchList();

		const header = computed(() => {
			return {
				title: "Cadastro de cidadãos",
				subtitle: "Visualize e gerencie os cadastros de cidadãos",
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
							router.push({ name: "citizens-create" });
						},
					},
				],
			};
		});

		const emptyState = computed(() => {
			return {
				isEmpty: citizensList.citizens.length === 0,
				isIcon: true,
				title: "Nenhum cidadão cadastrado",
				description:
					"Você ainda não possui nenhum cidadão cadastrado.Clique no botão 'Novo cadastro' para adicionar um.",
			};
		});
		return {
			header,
			emptyState,
		};
	},
});
</script>

<template>
	<div class="wrapper-template">
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
				<div v-if="emptyState.isEmpty" class="header-actions">
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
					<OrganismsCitizens />
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
