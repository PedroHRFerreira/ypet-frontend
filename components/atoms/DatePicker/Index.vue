<script lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
	name: "AtomsDatePicker",
	components: { VueDatePicker },
	props: {
		modelValue: {
			type: Array as () => Date[],
			default: () => [],
		},
		placeholder: {
			type: String,
			default: "Selecione a data",
		},
		inline: {
			type: Boolean,
			default: false,
		},
		border: {
			type: String,
			default: "1px solid var(--greys-colors-500)",
		},
	},
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const dateRange = computed({
			get: () => props.modelValue,
			set: (newDate) => emit("update:modelValue", newDate),
		});

		const options = {
			input: "customDatepickerInput",
		};

		const cssVars = computed(() => ({
			"--border": props.border,
		}));

		const textInputOptions = {
			rangeSeparator: " ~ ",
		};

		return {
			textInputOptions,
			dateRange,
			options,
			cssVars,
		};
	},
});
</script>

<template>
	<div class="datepicker-wrapper">
		<VueDatePicker
			v-model="date"
			locale="pt"
			format="dd/MM/yyyy"
			dark
			auto-apply
			hide-input-icon
			:style="cssVars"
			:ui="options"
			:teleport="false"
			:text-input="textInputOptions"
			:placeholder="placeholder"
			:enable-time-picker="false"
			:inline="inline"
		/>
	</div>
</template>

<style lang="scss">
@import "styles.module.scss";
</style>
<style scoped>
.dp__flex_display {
	display: flow;
}

.dp__menu {
	border: none;
}
</style>
