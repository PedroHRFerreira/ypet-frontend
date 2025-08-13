<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
	name: "AtomsBaseRadio",
	props: {
		name: {
			type: String,
			required: true,
		},
		option: {
			type: Object as PropType<IOption>,
			required: false,
			default: () => ({ id: "", text: "Lorem Ipsum", state: "default" }),
		},
	},
	emits: ["onChange"],
	setup(props, { emit }) {
		const handleChange = (event: Event) => {
			const target = event.target as HTMLInputElement;
			const option = {
				...props.option,
				state: target.checked ? "activated" : "default",
			};
			emit("onChange", option);
		};

		const state = computed(() => {
			return props.option?.state || "default";
		});
		const value = computed(() => {
			return props.option?.id || "";
		});
		const label = computed(() => {
			return props.option?.text || "Lorem Ipsum";
		});
		const isChecked = computed(() => {
			return state.value === "activated";
		});

		return {
			value,
			label,
			isChecked,
			handleChange,
		};
	},
});
</script>

<template>
	<label class="radio-wrapper">
		<input
			type="radio"
			class="radio-input"
			:value="value"
			:checked="isChecked"
			:name="name"
			@input="handleChange($event)"
			@change="handleChange($event)"
		/>
		<span class="custom-radio"></span>
		<span class="radio-label">{{ label }}</span>
	</label>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
