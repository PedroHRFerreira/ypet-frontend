<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

defineComponent({
	name: "AtomsIconsEye",
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
		xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		viewBox="0 0 24 25"
		fill="none"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16 12.6514C16 14.8605 14.2091 16.6514 12 16.6514C9.79086 16.6514 8 14.8605 8 12.6514C8 10.4422 9.79086 8.65137 12 8.65137C14.2091 8.65137 16 10.4422 16 12.6514ZM14 12.6514C14 13.7559 13.1046 14.6514 12 14.6514C10.8954 14.6514 10 13.7559 10 12.6514C10 11.5468 10.8954 10.6514 12 10.6514C13.1046 10.6514 14 11.5468 14 12.6514Z"
			:fill="currentColor"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M12 3.65137C17.5915 3.65137 22.2898 7.47569 23.6219 12.6514C22.2898 17.8271 17.5915 21.6514 12 21.6514C6.40848 21.6514 1.71018 17.8271 0.378052 12.6514C1.71018 7.47569 6.40848 3.65137 12 3.65137ZM12 19.6514C7.52443 19.6514 3.73132 16.7095 2.45723 12.6514C3.73132 8.59323 7.52443 5.65137 12 5.65137C16.4756 5.65137 20.2687 8.59323 21.5428 12.6514C20.2687 16.7095 16.4756 19.6514 12 19.6514Z"
			:fill="currentColor"
		/>
	</svg>
</template>
