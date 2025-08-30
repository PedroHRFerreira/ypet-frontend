<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AtomsBadges",
	props: {
		type: {
			type: String,
			default: "number",
			validator: (value: string) => ["only", "number", "text"].includes(value),
		},
		color: {
			type: String,
			default: "var(--success-colors-500)",
		},
		isBorder: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: "1",
		},
	},
	computed: {
		isTextOrNumber() {
			return ["text", "number"].includes(this.type);
		},
		background() {
			return this.withAlpha(this.color, 0.25);
		},
	},
	methods: {
		withAlpha(hex: string, alpha: number) {
			let h = hex.replace("#", "");
			if (h.length === 3)
				h = h
					.split("")
					.map((c) => c + c)
					.join("");
			const n = parseInt(h, 16);
			const r = (n >> 16) & 255;
			const g = (n >> 8) & 255;
			const b = n & 255;

			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		},
	},
});
</script>

<template>
	<span
		:class="[
			'wrapper-badges',
			'wrapper-badges__' + type,
			'wrapper-badges__' + color,
		]"
	>
		{{ isTextOrNumber ? text : "" }}
	</span>
</template>

<style scoped lang="scss">
@use "styles.module";
.wrapper-badges {
	background: v-bind(background);
}
</style>
