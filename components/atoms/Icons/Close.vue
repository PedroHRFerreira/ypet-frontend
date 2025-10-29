<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

defineComponent({
	name: "AtomsIconsClose",
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
		viewBox="0 0 32 32"
		:fill="currentColor"
	>
		<path
			d="M8.30031 6.41476C7.77961 5.89406 6.93539 5.89406 6.41469 6.41476C5.894 6.93545 5.894 7.77967 6.41469 8.30037L14.1143 16L6.41477 23.6996C5.89408 24.2203 5.89407 25.0645 6.41477 25.5852C6.93547 26.1059 7.77969 26.1059 8.30039 25.5852L16 17.8856L23.6995 25.5852C24.2202 26.1059 25.0644 26.1059 25.5851 25.5852C26.1058 25.0645 26.1058 24.2203 25.5851 23.6996L17.8856 16L25.5852 8.30037C26.1059 7.77967 26.1059 6.93545 25.5852 6.41476C25.0645 5.89406 24.2203 5.89406 23.6996 6.41476L16 14.1144L8.30031 6.41476Z"
			:fill="currentColor"
		/>
	</svg>
</template>
