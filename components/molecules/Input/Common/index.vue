<script lang="ts">
export default defineComponent({
	name: "MoleculesInputCommon",
	props: {
		label: {
			type: String,
			default: "",
		},
		value: {
			type: String,
			default: "",
		},
		message: {
			type: String,
			default: null,
		},
		messageError: {
			type: String,
			default: null,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		typeInput: {
			type: String,
			default: "text",
		},
		maxlength: {
			type: Number,
			default: 255,
		},
		min: {
			type: String,
			default: null,
		},
		max: {
			type: String,
			default: null,
		},
		success: {
			type: Boolean,
			default: false,
		},
    maxWidth: {
      type: String,
      default: "100%",
    }
	},
	emits: ["on-input", "on-blur", "on-keyup-enter", "on-focusout", "on-focus"],

	setup(props, { emit }) {
		const inputValue = ref(props.value);
		const { formatCurrency } = useFormatCurrencyInput();

		const handleInput = (event: Event) => {
			const target = event.target as HTMLInputElement;
			let newValue = target.value;

			if (props.typeInput === "money") {
				newValue = formatCurrency(newValue);
			}

			emit("on-input", newValue);
			inputValue.value = newValue;
		};

		const isMessage = computed(() => {
			return !!props.message;
		});
		const isMessageError = computed(() => {
			return !!props.messageError;
		});
		const isActive = computed(() => {
			return !!inputValue.value;
		});
		const messageDefault = computed(() => {
			if (props.messageError) {
				return props.messageError;
			}
			return props.message;
		});

		watch(
			() => props.value,
			(newValue) => {
				inputValue.value = newValue;
			},
		);

		return {
			handleInput,
			isMessageError,
			messageDefault,
			inputValue,
			isMessage,
			isActive,
		};
	},
});
</script>
<template>
	<div class="input-common anim-loading">
		<div
			:class="[
				'input-common__label',
				{ 'input-common__label--disabled': isDisabled },
				{ 'input-common__label--error': isMessageError },
				{ 'input-common__label--success': success },
			]"
		>
			{{ label }}
		</div>
		<div
			:class="[
				'input-common__input',
				{ 'input-common__input--success': success },
				{ 'input-common__input--error': isMessageError },
				{ 'input-common__input--disabled': isDisabled },
			]"
		>
			<div class="input-common__content">
				<input
					v-model="inputValue"
					:placeholder="label"
					:type="typeInput"
					:disabled="isDisabled"
					:min="min"
					:max="max"
					:maxlength="maxlength"
					@input="handleInput"
					@keyup.enter="$emit('on-keyup-enter', inputValue)"
					@blur="$emit('on-blur', inputValue)"
					@focus="$emit('on-focus', inputValue)"
					@focusout="$emit('on-focusout', inputValue)"
				/>
				<slot />
			</div>
			<div v-if="isMessageError && !success" class="input-common__info">
				<AtomsIcon
					filled
					class="input-common__info--error"
					name="check"
					width="24px"
					height="24px"
					current-color="var(--greys-colors-100)"
				/>
			</div>
			<div v-if="success" class="input-common__info">
				<AtomsIcon
					filled
					class="input-common__info--success"
					name="check"
					width="24px"
					height="24px"
					current-color="var(--greys-colors-100)"
				/>
			</div>
		</div>
		<AtomsTypography
			v-if="isMessageError || isMessage"
			:class="[
				'input-common__message',
				{ 'input-common__message--success': success },
				{ 'input-common__message--error': isMessageError },
				{ 'input-common__message--disabled': isDisabled },
			]"
			type="text-p6"
			:text="messageDefault"
		/>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";

.input-common {
  max-width: v-bind(maxWidth);
}
</style>
