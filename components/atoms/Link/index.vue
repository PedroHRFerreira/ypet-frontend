<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AtomsLink",
	props: {
		text: {
			type: String,
			default: "Link",
		},
		color: {
			type: String,
			default: "primary",
		},
		withIcon: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["onclick"],
});
</script>

<template>
	<div class="link" @click="$emit('onclick')">
		<span :class="[color]">
			{{ text }}
		</span>
		<AtomsIcon v-if="withIcon" name="arrow-right" :current-color="color" />
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
