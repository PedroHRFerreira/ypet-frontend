<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "MoleculesUploadField",

	props: {
		label: {
			type: String,
			default: "Selecione uma imagem",
		},
		description: {
			type: String,
			default: "",
		},
		accept: {
			type: String,
			default: "image/*",
		},
		value: {
			type: [String, Number, null, Boolean, Array<any>, File],
			default: "",
		},
		maxSize: {
			type: Number,
			default: 5 * 1024 * 1024,
		},
		maxWidth: {
			type: [String, Number],
			default: 200,
		},
		maxHeight: {
			type: [String, Number],
			default: 200,
		},
		state: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return ["default", "hover", "pressed", "disabled", "error"].includes(
					value,
				);
			},
		},
	},

	emits: ["input", "change", "error"],

	data() {
		return {
			fileName: "",
			filePreview: "" ?? this.value,
			errorMessage: "",
		};
	},

	methods: {
		handleFile(event: Event) {
			const input = event.target as HTMLInputElement;
			const file = input.files ? input.files[0] : null;
			if (!file) return;

			if (file.size > this.maxSize) {
				this.errorMessage = `Tamanho máximo permitido é ${(this.maxSize / 1024 / 1024).toFixed(1)} MB.`;
				this.$emit("error", this.errorMessage);
				return;
			}

			this.fileName = file.name;
			this.errorMessage = "";

			const reader = new FileReader();
			reader.onload = () => {
				this.filePreview = reader.result as string;
				this.$emit("input", file);
			};
			reader.readAsDataURL(file);

			this.$emit("change", file);
		},

		clearFile() {
			this.fileName = "";
			this.filePreview = "";
			this.errorMessage = "";
			(this.$refs.inputUpload as HTMLInputElement).value = "";
			this.$emit("input", null);
		},
	},

	computed: {
		hasError(): boolean {
			return this.state === "error" || !!this.errorMessage;
		},
		boxStyle(): Record<string, string> {
			const width =
				typeof this.maxWidth === "number"
					? `${this.maxWidth}px`
					: this.maxWidth;
			const height =
				typeof this.maxHeight === "number"
					? `${this.maxHeight}px`
					: this.maxHeight;
			return { width, height };
		},
	},
});
</script>

<template>
	<div
		class="upload-wrapper"
		:class="[state, { error: hasError }]"
		:style="boxStyle"
	>
		<input
			ref="inputUpload"
			class="upload-input"
			type="file"
			:accept="accept"
			hidden
			@change="handleFile"
			:disabled="state === 'disabled'"
		/>

		<div class="upload-box" @click="$refs.inputUpload.click()">
			<div v-if="!filePreview" class="upload-placeholder">
				<AtomsTypography
					type="text-p5"
					weight="bold"
					:text="label"
					color="var(--brand-color-dark-blue-300)"
				/>
				<AtomsTypography
					type="text-p5"
					:text="description"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>

			<div v-else class="upload-preview">
				<img :src="filePreview" alt="Preview" />
				<button class="clear-btn" @click.stop="clearFile">✕</button>
			</div>
		</div>

		<div v-if="hasError" class="error-message">
			{{ errorMessage }}
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
