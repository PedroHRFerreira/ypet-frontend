<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "MoleculesInputOptionGroup",
	props: {
		label: {
			type: String,
			required: true,
		},
		options: {
			type: Array as () => IOption[],
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Array<string>, Number, Boolean, null],
			default: "",
		},
	},
	emits: ["changeOption"],
	setup(props, { emit }) {
		const items = ref([] as IOption[]);

		items.value = props.options.map((option) => ({
			...option,
			state:
				option.id === props.value ? "activated" : option.state || "default",
		}));

		const handleOptionChange = (selectedOption: IOption) => {
			emit("changeOption", selectedOption);
		};

		return {
			items,
			handleOptionChange,
		};
	},
});
</script>

<template>
	<div class="input-option-group">
		<label class="group-label">{{ label }}</label>
		<div class="options-container">
			<AtomsBaseRadio
				v-for="(option, index) in items"
				:key="index"
				:name="name"
				:option="option"
				@on-change="handleOptionChange"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
