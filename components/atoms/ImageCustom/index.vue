<script lang="ts">
export default defineComponent({
	name: "AtomsImageCustom",
	props: {
		src: {
			type: String,
			default: "#",
		},
		alt: {
			type: String,
			default: "",
		},
		objectFit: {
			type: String,
			default: "cover",
		},
		width: {
			type: String,
			default: "auto",
		},
		height: {
			type: String,
			default: "auto",
		},
		minWidth: {
			type: String,
			default: "auto",
		},
		minHeight: {
			type: String,
			default: "auto",
		},
		maxWidth: {
			type: String,
			default: "auto",
		},
		maxHeight: {
			type: String,
			default: "auto",
		},
		aspectRatio: {
			type: String,
			default: "auto",
		},
		borderRadius: {
			type: String,
			default: "0",
		},
		margin: {
			type: String,
			default: "0",
		},
		bgColor: {
			type: String,
			default: "transparent",
		},
	},
	setup(props) {
		const normalImageLoad = ref(true);
		const image = ref(props.src);

		const cssVars = computed(() => ({
			"--objectFit": props.objectFit,
			"--width": props.width,
			"--height": props.height,
			"--minWidth": props.minWidth,
			"--minHeight": props.minHeight,
			"--maxWidth": props.maxWidth,
			"--maxHeight": props.maxHeight,
			"--aspectRatio": props.aspectRatio,
			"--borderRadius": props.borderRadius,
			"--bgColor": props.bgColor,
			"--margin": props.margin,
		}));

		watch(
			() => props.src,
			(newValue) => {
				if (!newValue) {
					image.value = "";
					return;
				}
				image.value = newValue;
			},
		);
		return { normalImageLoad, cssVars, image };
	},
});
</script>

<template>
	<div class="wrapper-image" :style="cssVars">
		<img
			v-if="normalImageLoad && src"
			class="wrapper-image__image"
			loading="lazy"
			:src="image"
			:alt="alt"
			@error="normalImageLoad = false"
		/>
		<div v-else class="wrapper-image__error">
			<img
				class="wrapper-image__error"
				src="@/public/images/notfoundimage.png"
				alt="Ocorreu um erro"
			/>
		</div>
	</div>
</template>

<style scoped>
@import "styles.module.scss";
</style>
