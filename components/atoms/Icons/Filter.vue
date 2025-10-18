<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

defineComponent({
	name: "AtomsIconsFilter",
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
		width="17"
		height="16"
		viewBox="0 0 17 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_5129_4036)">
			<path
				d="M13.8333 14.0003V10.667"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M11.8333 10.667H15.8333"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M3.16675 13.9997V9.33301"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.16675 9.33301H5.16675"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.5 14V8"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.5 5.33301H10.5"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13.8333 8V2"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.5 5.33333V2"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M3.16675 6.66667V2"
				stroke="#394E75"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_5129_4036">
				<rect width="16" height="16" fill="white" transform="translate(0.5)" />
			</clipPath>
		</defs>
	</svg>
</template>
