<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
	variant: {
		type: String,
		default: "primary",
		validator(value: string) {
			return ["primary", "outline"].includes(value);
		},
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String as PropType<"button" | "submit" | "reset">,
		default: "button",
		validator(value: "button" | "submit" | "reset") {
			return ["button", "submit", "reset"].includes(value);
		},
	},
});

const emit = defineEmits(["click"]);

defineComponent({ name: "AtomsButton" });

function onClick(e: MouseEvent) {
	if (props.disabled) return;
	emit("click", e);
}
</script>

<template>
	<button
		:type="type"
		:disabled="disabled"
		:class="[
			'atoms-button',
			`atoms-button--${variant}`,
			{ 'is-disabled': disabled },
		]"
		@click="onClick"
	>
		<slot />
	</button>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
