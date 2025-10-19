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
		messageError: {
			type: String,
			default: null,
		},
		maxWidth: {
			type: String,
			default: "100%",
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

		watch(
			() => [props.value, props.options],
			([newValue, newOptions]) => {
				const selectedValue = Array.isArray(newValue)
					? (newValue as any[])[0]
					: (newValue as any);
				items.value = (newOptions as IOption[]).map((option) => {
					const isActive = String(option.id) === String(selectedValue);
					return {
						...option,
						state: isActive ? "activated" : option.state || "default",
					};
				});
			},
			{ deep: true, immediate: true },
		);

		const handleOptionChange = (selectedOption: IOption) => {
			emit("changeOption", selectedOption);
		};

		const isMessageError = computed(() => {
			return !!props.messageError;
		});

		return {
			items,
			isMessageError,
			handleOptionChange,
		};
	},
});
</script>

<template>
	<div class="input-option-group">
		<label :class="['group-label', { 'has-error': isMessageError }]">
			{{ label }}
		</label>
		<div :class="['options-container', { 'has-error': isMessageError }]">
			<AtomsBaseRadio
				v-for="option in items"
				:key="option.id"
				:name="name"
				:option="option"
				@on-change="handleOptionChange"
			/>
		</div>
		<div v-if="isMessageError" class="has-error">
			<AtomsTypography
				type="text-p6"
				weight="regular"
				:text="messageError"
				color="var(--danger-colors-700)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";

.input-option-group {
	max-width: v-bind(maxWidth);
}
</style>
