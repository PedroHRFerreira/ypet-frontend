<script lang="ts" setup>
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps<{
	label: string;
	value: string | number | boolean;
	modelValue: string | number | boolean;
	name: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string | number | boolean): void;
}>();

const internalValue = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
});
</script>

<template>
	<label class="radio-wrapper">
		<input
			type="radio"
			class="radio-input"
			:value="value"
			:name="name"
			v-model="internalValue"
			@change="$emit('update:modelValue', value)"
		/>
		<span class="custom-radio"></span>
		<span class="radio-label">{{ label }}</span>
	</label>
</template>

<style scoped>
.radio-wrapper {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	position: relative;
}

.radio-input {
	display: none;
}

.custom-radio {
	width: 24px;
	height: 24px;
	border: 2px solid #ccc;
	border-radius: 50%;
	position: relative;
}

.radio-input:checked + .custom-radio::after {
	content: "";
	position: absolute;
	top: 5px;
	left: 5px;
	width: 12px;
	height: 12px;
	background-color: #2b3a67;
	border-radius: 50%;
}

.radio-label {
	color: #2b3a67;
	font-weight: 500;
}
</style>
