<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesSettings",
	setup() {
		const header = computed(() => ({
			title: "Configurações",
			subtitle: "Gerencie os dados da sua conta e informações da operação",
		}));

		return {
			header,
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
			</header>

			<main class="main">
				<OrganismsSettings />
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
