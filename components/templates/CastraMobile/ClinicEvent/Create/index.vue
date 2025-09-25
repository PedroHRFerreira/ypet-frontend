<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesCastraMobileClinicEventCreate",
	setup() {
		const header = computed(() => {
			return {
				title: "Editar evento clínico",
				subtitle: "Altere as informações do evento clínico",
				buttons: [],
			};
		});

		return {
			header,
		};
	},
});
</script>

<template>
	<div class="animal-create">
		<div class="content">
			<div class="header">
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
				<div v-if="header.buttons.length" class="header-actions">
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
			</div>
			<div class="main">
				<OrganismsCastraMobileClinicEventCreate />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
