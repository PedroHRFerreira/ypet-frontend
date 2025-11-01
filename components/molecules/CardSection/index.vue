<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: "",
	},
	subtitle: {
		type: String,
		default: "",
	},
});

defineComponent({ name: "MoleculesCardSection" });
</script>

<template>
	<AtomsCard class="molecules-card-section">
		<header class="molecules-card-section__header">
			<AtomsTypography
				type="title-h7"
				weight="semi-bold"
				class="molecules-card-section__title"
			>
				{{ title }}
			</AtomsTypography>
			<AtomsTypography
				v-if="subtitle"
				type="text-p5"
				weight="regular"
				class="molecules-card-section__subtitle"
				:color="'var(--brand-color-dark-blue-300)'"
			>
				{{ subtitle }}
			</AtomsTypography>
			<div class="molecules-card-section__actions">
				<slot name="actions" />
			</div>
		</header>
		<div class="molecules-card-section__content">
			<slot />
		</div>
	</AtomsCard>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
