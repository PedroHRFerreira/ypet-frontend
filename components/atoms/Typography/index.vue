<script setup lang="ts">
const props = defineProps({
	type: {
		type: String,
		default: "title-h1",
		validator(value: string) {
			return [
				"title-h1",
				"title-h2",
				"title-h3",
				"title-h4",
				"title-h5",
				"title-h6",
				"title-h7",
				"text-p1",
				"text-p2",
				"text-p3",
				"text-p4",
				"text-p5",
				"text-p6",
				"text-p7",
			].includes(value);
		},
	},
	weight: {
		type: String,
		default: "regular",
		validator(value: string) {
			return ["regular", "medium", "semi-bold", "extra-bold"].includes(value);
		},
	},
	text: {
		type: String,
		default: () => {
			return "Typography";
		},
	},
	color: {
		type: String,
		default: "currentColor",
	},
	singleLine: {
		type: Boolean,
		default: false,
	},
	fontFamily: {
		type: String,
		default: "Montserrat",
		validator(value: string) {
			return ["Montserrat"].includes(value);
		},
	},
});

const typographyColor = computed(() => {
	return props.color;
});

const typographyFontFamily = computed(() => {
	return props.fontFamily;
});

const component = computed(() => {
	const components = {
		"title-h1": "h1",
		"title-h2": "h2",
		"title-h3": "h3",
		"title-h4": "h4",
		"title-h5": "h5",
		"title-h6": "h6",
		"title-h7": "p",
		"text-p1": "p",
		"text-p2": "p",
		"text-p3": "p",
		"text-p4": "p",
		"text-p5": "p",
		"text-p6": "p",
		"text-p7": "p",
	};

	return components[props.type as keyof typeof components];
});

defineComponent({
	name: "AtomsTypography",
});
</script>
<template>
	<component
		:is="component"
		:class="[
			`${type}`,
			`${type}-${weight}`,
			`typography `,
			{ 'single-line': singleLine },
		]"
	>
		{{ text }}
		<slot />
	</component>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
.typography {
	font-family: v-bind(typographyFontFamily);
	color: v-bind(typographyColor);
}
</style>
