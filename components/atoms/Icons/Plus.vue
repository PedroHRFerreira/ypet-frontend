<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

defineComponent({
	name: "AtomsIconsPaste",
});

withDefaults(
	defineProps<{
		name: string;
		filled?: boolean;
		width?: string | number;
		height?: string | number;
		currentColor?: string;
	}>(),
	{
		filled: false,
		height: "24px",
		width: "24px",
		currentColor: "currentColor",
	},
);
</script>

<template>
	<svg
		:width="width"
		:height="height"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 5V19"
			:stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M5 12H19"
			:stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>
