<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesLocationsCreate",
	setup() {
		const header = computed(() => ({
			title: "Cadastro de locais",
			subtitle: "Visualize e gerencie os cadastros de locais",
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
				<OrganismsLocationsCreate />
			</main>
		</div>
	</div>
</template>
