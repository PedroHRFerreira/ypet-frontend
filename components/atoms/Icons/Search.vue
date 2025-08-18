<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

defineComponent({
	name: "AtomsIconsPlus",
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
		viewBox="0 0 24 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.4196 16.5588C18.8633 13.4204 18.6426 8.87969 15.7574 5.99451C12.6332 2.87032 7.56786 2.87032 4.44367 5.99451C1.31948 9.11871 1.31948 14.184 4.44367 17.3082C7.32885 20.1934 11.8695 20.4141 15.008 17.9704C15.0215 17.9857 15.0356 18.0007 15.0503 18.0153L19.2929 22.258C19.6834 22.6485 20.3166 22.6485 20.7071 22.258C21.0977 21.8674 21.0977 21.2343 20.7071 20.8438L16.4645 16.6011C16.4498 16.5865 16.4349 16.5724 16.4196 16.5588ZM14.3432 7.40873C16.6863 9.75187 16.6863 13.5509 14.3432 15.894C12 18.2372 8.20103 18.2372 5.85788 15.894C3.51474 13.5509 3.51474 9.75187 5.85788 7.40873C8.20103 5.06558 12 5.06558 14.3432 7.40873Z"
			:fill="currentColor"
		/>
	</svg>
</template>
