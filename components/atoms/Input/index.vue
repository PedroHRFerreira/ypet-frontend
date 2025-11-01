<script setup lang="ts">
const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
	type: {
		type: String,
		default: "text",
	},
	placeholder: {
		type: String,
		default: "",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "input"]);

defineComponent({ name: "AtomsInput" });

function onInput(e: Event) {
	const target = e.target as HTMLInputElement;
	emit("update:modelValue", target.value);
	emit("input", target.value);
}
</script>

<template>
	<input
		:type="type"
		:value="modelValue"
		:placeholder="placeholder"
		:disabled="disabled"
		class="atoms-input"
		@input="onInput"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
	/>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
