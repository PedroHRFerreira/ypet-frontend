<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "MoleculesEmptyState",
	props: {
		size: {
			type: String,
			default: "large",
			validator: (value: string) =>
				["large", "medium", "small"].includes(value),
		},
		isIcon: {
			type: Boolean,
			default: true,
			validator: (value: boolean) => [true, false].includes(value),
		},
		isTitle: {
			type: Boolean,
			default: true,
			validator: (value: boolean) => [true, false].includes(value),
		},
		title: {
			type: String,
			default:
				"It was popularised in the with the release letraset sheets containing.",
		},
		isDescription: {
			type: Boolean,
			default: true,
			validator: (value: boolean) => [true, false].includes(value),
		},
		description: {
			type: String,
			default: "Lorem ipsum release of Letraset sheets containing.",
		},
		iconName: {
			type: String,
			default: "empty-state",
		},
		iconColor: {
			type: String,
			default: "current",
		},
	},
	setup(_props) {
		const iconSizes = {
			large: "250px",
			medium: "100px",
			small: "50px",
		};

		return {
			iconSizes,
		};
	},
});
</script>

<template>
	<div class="wrapper-empty-state">
		<div v-if="isIcon" class="wrapper-empty-state__icon">
			<AtomsIcon
				:name="iconName"
				:width="iconSizes[size]"
				:height="iconSizes[size]"
				:color="iconColor"
				class="wrapper-empty-state__icon-svg"
			/>
		</div>
		<div class="wrapper-empty-state__text">
			<AtomsTypography
				v-if="isTitle"
				type="text-p1"
				weight="medium"
				:text="title"
				color="var(--greys-colors-800)"
			/>
			<AtomsTypography
				v-if="isDescription"
				type="text-p3"
				weight="regular"
				:text="description"
				color="var(--greys-colors-500)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
