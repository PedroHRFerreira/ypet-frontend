<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "MoleculesAvatarIcon",
	props: {
		state: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return ["default", "hover", "pressed", "disabled"].includes(value);
			},
		},
		size: {
			type: String,
			default: "small",
			validator: (value: string) => {
				return ["small", "extra-small"].includes(value);
			},
		},
		hasNotification: {
			type: Boolean,
			default: true,
		},
		bgColorNotification: {
			type: String,
			default: "var(--succes-colors-500)",
		},
		userImage: {
			type: String,
			default: "",
		},
		nameUser: {
			type: String,
			default: "Lorem Ipsum",
		},
		file: {
			type: [Object, Array, String, File],
			default: null,
		},
		accept: {
			type: String,
			default: "image/*",
		},
	},
	emits: ["click", "input"],
	data() {
		return {
			imageSrc: null,
			hasWarning: false,
		};
	},
	computed: {
		userInitials(): string {
			const nameParts = this.nameUser?.split(" ");
			const firstInitial = nameParts[0]?.charAt(0)?.toLocaleUpperCase() || "";

			if (nameParts.length >= 2) {
				const secondInitial =
					nameParts[1]?.charAt(0)?.toLocaleUpperCase() || "";
				return `${firstInitial}${secondInitial}`;
			}
			const secondLetter = nameParts[0]?.charAt(1)?.toLocaleUpperCase() || "";
			const singleName = `${firstInitial}${secondLetter}`;
			return singleName;
		},
	},
	methods: {
		renderImage(file: File) {
			if (file.size > 5242880) {
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				this.imageSrc = reader.result;
				const base64Image = reader.result.split(",")[1];
				this.$emit("input", base64Image);
			};

			reader.readAsDataURL(file);
		},
	},
});
</script>
<template>
	<div class="avatar-wrapper" @click="$emit('click')">
		<input
			ref="inputImage"
			class="input-image"
			type="file"
			hidden
			:accept="accept"
			@input="
				renderImage($event.target.files[0]),
					$emit('input', $event.target.files[0])
			"
		/>
		<div
			v-if="hasNotification"
			:class="['avatar-notification', size, state]"
			:style="{ 'background-color': bgColorNotification }"
		/>
		<div v-show="imageSrc" :class="['avatar', size, state]">
			<div class="avatar-image">
				<img :src="imageSrc" alt="imagem do usuario" />
			</div>
		</div>
		<div v-show="!imageSrc" :class="['avatar', size, state]">
			<div v-if="userImage" class="avatar-image">
				<img :src="userImage" alt="imagem do usuario" />
			</div>
			<div v-else class="initials">
				<AtomsTypography
					type="text-p4"
					:text="userInitials"
					weight="medium"
					color="var(--white)"
				/>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
