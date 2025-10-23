<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesOccurrencesReportDetails",
	setup() {
		const header = computed(() => {
			return {
				title: "Detalhes da denuncia",
				subtitle: "Visualize os detalhes da denuncia",
				buttons: [
					{
						text: "Voltar",
						type: "outline",
						icon: "arrow-left",
						iconLeft: true,
						nameIconLeft: "arrow-left",
						iconRight: false,
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.back();
						},
					},
				],
			};
		});

		const emptyState = computed(() => {
			return {
				isEmpty: true,
				isIcon: true,
				title: "",
				description: "",
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
						v-for="button in header.buttons"
						:key="button.text"
						:type="button.type"
						:text="button.text"
						:icon-left="button.iconLeft"
						:icon-right="button.iconRight"
						:name-icon-left="button.nameIconLeft"
						:name-icon-right="button.nameIconRight"
						:size="button.size"
						:width="button.width"
						@onclick="button.action"
					/>
				</div>
			</header>
			<main class="main">
				<div class="main-content">
					<OrganismsOccurrencesAbuseReportsDetails />
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "style.module";
</style>
