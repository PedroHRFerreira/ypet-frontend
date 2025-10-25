<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
	name: "TemplatesApplications",
	setup() {
		const header = computed(() => ({
			title: "Aplicações",
			subtitle:
				"Registre vacinas, vermífugos, medicações, suplementos ou rações especiais administrados a um animal.",
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
						router.push({ name: "applications-create" });
					},
				},
			],
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
				<div class="main-content">
					<OrganismsApplicationsCreate />
				</div>
			</main>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>