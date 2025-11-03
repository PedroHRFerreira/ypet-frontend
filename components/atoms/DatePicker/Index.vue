<script lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default defineComponent({
	name: "AtomsDatePicker",
	components: { VueDatePicker },
	props: {
		modelValue: {
			type: [Date, null] as unknown as () => Date | null,
			default: null,
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
		const dateValue = computed<Date | null>({
			get: () => props.modelValue ?? null,
			set: (newDate) => emit("update:modelValue", newDate ?? null),
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
			dateValue,
			options,
			cssVars,
		};
	},
});
</script>

<template>
	<div class="datepicker-wrapper">
		<VueDatePicker
			v-model="dateValue"
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
