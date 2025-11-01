<script setup lang="ts">
const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	placeholder: {
		type: String,
		default: "",
	},
	rows: {
		type: Number,
		default: 4,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "input"]);

defineComponent({ name: "AtomsTextarea" });

function onInput(e: Event) {
	const target = e.target as HTMLTextAreaElement;
	emit("update:modelValue", target.value);
	emit("input", target.value);
}
</script>

<template>
	<textarea
		:rows="rows"
		:value="modelValue"
		:placeholder="placeholder"
		:disabled="disabled"
		class="atoms-textarea"
		@input="onInput"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
	/>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
