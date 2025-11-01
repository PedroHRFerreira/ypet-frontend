<script setup lang="ts">
type Option = { label: string; value: string | number };

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
	options: {
		type: Array as () => Option[],
		default: () => [],
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

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

defineComponent({ name: "AtomsSelect" });

function onChange(e: Event) {
	const target = e.target as HTMLSelectElement;
	const value = target.value;
	emit("update:modelValue", value);
	emit("change", value);
}
</script>

<template>
	<select
		:value="modelValue"
		:disabled="disabled"
		class="atoms-select"
		@change="onChange"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
	>
		<option v-if="placeholder" disabled value="">{{ placeholder }}</option>
		<option v-for="opt in options" :key="String(opt.value)" :value="opt.value">
			{{ opt.label }}
		</option>
	</select>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
