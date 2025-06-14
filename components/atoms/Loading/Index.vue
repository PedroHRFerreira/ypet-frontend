<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AtomsLoading",
	props: {
		state: {
			type: String,
			default: "flip",
			validator: (value: string) => {
				return ["success", "flip"].includes(value);
			},
		},
		color: {
			type: String,
			default: "red",
			validator: (value: string) => {
				return ["white", "green", "red"].includes(value);
			},
		},
		size: {
			type: String,
			default: "medium",
			validator: (value: string) => {
				return [
					"extra-large",
					"large",
					"medium",
					"small",
					"extra-small",
				].includes(value);
			},
		},
	},
	setup(props) {
		const colors = {
			white: "#FFFFFF",
			green: "#1DD1A6",
			red: "#f52828",
		};

		return {
			stopColor: colors[props.color],
		};
	},
	computed: {
		isStateSuccess() {
			return this.state === "success";
		},
		isStateFlip() {
			return this.state === "flip";
		},
	},
});
</script>

<template>
	<span v-if="isStateFlip" :class="['wrapper-loading', size, state]">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			height="800"
			width="800"
			x="0"
			y="0"
			viewBox="0 0 800 800"
		>
			<defs>
				<linearGradient id="Gradient1" gradientTransform="rotate(90)">
					<stop offset="0%" :stop-color="stopColor" />
					<stop offset="100%" :stop-color="stopColor" />
				</linearGradient>
				<linearGradient id="Gradient2" gradientTransform="rotate(90)">
					<stop offset="0%" :stop-color="stopColor" stop-opacity="0" />
					<stop offset="90%" :stop-color="stopColor" />
					<stop offset="100%" :stop-color="stopColor" />
				</linearGradient>
				<pattern
					id="Pattern"
					x="0"
					y="0"
					width="600"
					height="600"
					patternUnits="userSpaceOnUse"
				>
					<g transform="rotate(0, 300, 300)">
						<rect
							shape-rendering="crispEdges"
							x="0"
							y="0"
							width="300"
							height="600"
							fill="url(#Gradient1)"
						/>
						<rect
							shape-rendering="crispEdges"
							x="300"
							y="0"
							width="300"
							height="600"
							fill="url(#Gradient2)"
						/>
					</g>
				</pattern>
			</defs>
			<path
				class="rotating"
				style="stroke: url(#Pattern)"
				fill="transparent"
				transform="rotate(105, 300, 300)"
				stroke-width="100"
				d="M 364 58 A 250 250 0 1 1 235 58"
			/>
		</svg>
	</span>

	<span v-if="isStateSuccess" :class="['wrapper-loading', size, state]">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="23"
			viewBox="0 0 28 23"
			fill="none"
		>
			<path
				d="M10.5 15.281L3.5 8.02171L0 11.6513L10.5 22.5402L28 4.39208L24.5 0.762451L10.5 15.281Z"
				fill="white"
			/>
		</svg>
	</span>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
