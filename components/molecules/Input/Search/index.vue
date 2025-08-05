<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "MoleculesInputSearch",
	props: {
		state: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return [
					"default",
					"pressed",
					"actived",
					"filled",
					"erro",
					"disabled",
				].includes(value);
			},
		},
		label: {
			type: String,
			default: "Label",
		},
		value: {
			type: String,
			default: "",
		},
		close: {
			type: Boolean,
			default: false,
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
		height: {
			type: String,
			default: "40px",
		},
	},
	emits: ["onInput", "clearInput"],
	setup(props) {
		const { value } = toRefs(props);
		const inputValue = ref(value);

		return {
			inputValue,
		};
	},
	computed: {
		isMessage() {
			return !!this.message;
		},
		isMessageError() {
			return !!this.messageError;
		},
		messageDefault() {
			if (this.isMessageError) {
				return this.messageError;
			}
			return this.message;
		},
		colorIcon() {
			if (this.state === "disabled") {
				return "var(--greys-colors-600)";
			}
			return "var(--brand-color-dark-blue-200)";
		},
		colorIconError() {
			if (this.isMessageError) {
				return "var(--danger-colors-500)";
			}
			return "var(--brand-color-blue-600)";
		},
	},
});
</script>
<template>
	<div class="form-common-search" :class="[state]">
		<div
			class="form-common-search__input"
			:class="{
				'form-common-search__input--error': isMessageError,
				'form-common-search__input--disabled': isDisabled,
			}"
			:style="{
				height: height,
			}"
		>
			<div class="form-common-search__content">
				<AtomsIcon
					filled
					height="24px"
					width="24px"
					name="search"
					:current-color="colorIcon"
				/>
				<input
					:value="inputValue"
					:placeholder="label"
					:disabled="isDisabled"
					@input="
						$emit('onInput', $event?.target?.value ? $event?.target?.value : '')
					"
				/>
			</div>
			<div class="form-common-search__close">
				<div
					v-if="close"
					class="close-background"
					:class="{ isMessageError: 'error' }"
					@click="$emit('clearInput', $event)"
				>
					<AtomsIcon
						height="12px"
						width="12px"
						name="close"
						:current-color="colorIconError"
					/>
				</div>
			</div>
		</div>
		<AtomsTypography
			v-if="isMessage || isMessageError"
			class="form-common-search__message"
			:class="{
				'form-common-search__message--error': isMessageError,
				'form-common-search__message--disabled': isDisabled,
			}"
			type="text-p5"
			:text="messageDefault"
		/>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
