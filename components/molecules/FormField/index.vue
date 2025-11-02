<script setup lang="ts">
import type { PropType } from "vue";

type Option = { label: string; value: string | number };

defineProps({
	label: {
		type: String,
		default: "",
	},
	for: {
		type: String,
		default: "",
	},
	help: {
		type: String,
		default: "",
	},
	error: {
		type: String,
		default: "",
	},
	componentType: {
		type: String as PropType<"input" | "textarea" | "select">,
		default: "input",
	},
	modelValue: {
		type: [String, Number] as PropType<string | number>,
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
	options: {
		type: Array as PropType<Option[]>,
		default: () => [],
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue"]);

defineComponent({ name: "MoleculesFormField" });

function update(val: string | number) {
	emit("update:modelValue", val);
}
</script>

<template>
	<div class="molecules-form-field">
		<AtomsLabel :for="for">{{ label }}</AtomsLabel>

		<!-- Input -->
		<AtomsInput
			v-if="componentType === 'input'"
			:id="for"
			:placeholder="placeholder"
			:disabled="disabled"
			:model-value="modelValue"
			@update:modelValue="update"
		/>

		<!-- Textarea -->
		<AtomsTextarea
			v-else-if="componentType === 'textarea'"
			:id="for"
			:rows="rows"
			:placeholder="placeholder"
			:disabled="disabled"
			:model-value="String(modelValue)"
			@update:modelValue="update"
		/>

		<!-- Select -->
		<AtomsSelect
			v-else
			:id="for"
			:options="options"
			:placeholder="placeholder"
			:disabled="disabled"
			:model-value="modelValue"
			@update:modelValue="update"
		/>

		<div v-if="help || error" class="molecules-form-field__messages">
			<AtomsTypography
				type="text-p6"
				weight="regular"
				:color="
					error
						? 'var(--danger-colors-500)'
						: 'var(--brand-color-dark-blue-300)'
				"
			>
				{{ error || help }}
			</AtomsTypography>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
