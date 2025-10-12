<script lang="ts">
import { defineComponent } from "vue";
import { useListStore } from "~/stores/protectors/useListStore";

export default defineComponent({
	name: "TemplatesProtectors",
	async setup() {
		const protectorsList = useListStore();
		
		await protectorsList.fetchList();

		const header = computed(() => {
			return {
				title: "Protetores",
				subtitle: "Visualize e gerencie os cadastros de protetores",
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
							router.push({ name: "protectors-create" });
						},
					},
				],
			};
		});

		const emptyState = computed(() => {
			return {
				isEmpty: protectorsList.protectors.length === 0,
				isIcon: true,
				title: "Nenhum protetor cadastrado",
				description:
					"Você ainda não possui nenhum cidadão cadastrado. Clique no botão 'Novo cadastro' para adicionar um.",
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
				<div class="header-actions">
					<MoleculesButtonsCommon
						v-show="emptyState.isEmpty"
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
					<OrganismsProtectors/>
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
