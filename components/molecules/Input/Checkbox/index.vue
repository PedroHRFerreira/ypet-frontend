<script setup lang="ts">
import { defineProps, defineEmits, defineComponent } from "vue";

defineComponent({
	name: "MoleculeInputCheckbox",
});

const props = defineProps<{
	label: string;
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const onChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.checked);
};
</script>

<template>
	<label class="checkbox-container">
		<input type="checkbox" :checked="modelValue" @change="onChange" />
		<span class="checkmark"></span>
		<span class="label-text">{{ props.label }}</span>
	</label>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
