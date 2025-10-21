<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AtomsBadges",
	props: {
		type: {
			type: String,
			default: "counter",
			validator: (value: string) =>
				[
					"only",
					"solid",
					"soft",
					"solid-pill",
					"soft-pill",
					"counter",
					"counter-pill",
				].includes(value),
		},
		color: {
			type: String,
			default: "primary",
			validator: (value: string) =>
				[
					"primary",
					"secondary",
					"tertiary",
					"success",
					"warning",
					"danger",
					"information",
					"light",
					"dark",
					"custom",
				].includes(value),
		},
		size: {
			type: String,
			default: "small",
			validator: (value: string) => ["small", "medium"].includes(value),
		},
		text: {
			type: String,
			default: "",
		},
		customColor: {
			type: String,
			default: "",
		},
	},
	setup(props) {
		const hasCustomColor = computed(() => props.color === "custom");

		const wrapperClass = computed(() => [
			"wrapper-tag",
			props.type,
			props.color,
			props.size,
		]);

		return { wrapperClass, hasCustomColor };
	},
});
</script>

<template>
	<span
		:class="wrapperClass"
		:style="
			hasCustomColor ? { backgroundColor: customColor, color: '#fff' } : {}
		"
	>
		{{ text }}
	</span>
</template>

<style scoped lang="scss">
@use "styles.module";

.wrapper-tag {
	&.custom {
		background-color: v-bind(customColor);
		color: var(--white);
	}
}
</style>
