<script lang="ts">
import { defineComponent, computed, ref } from "vue";

export default defineComponent({
	name: "TemplatesLocations",
	setup() {
		const header = computed(() => ({
			title: "Locais cadastrados",
			subtitle: "Visualize e gerencie os cadastros de locais.",
		}));

		return { header };
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
						:text="header.title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsTypography
						type="text-p4"
						:text="header.subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
				</div>
			</header>

			<main class="main">
				<div v-if="false" class="main-empty">
					<MoleculesEmptyState
						:is-icon="true"
						title="Nenhum local cadastrado"
						description="Adicione um novo cadastro para começar."
					/>
				</div>

				<div v-else class="main-content">
					<OrganismsLocations />
				</div>
			</main>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
