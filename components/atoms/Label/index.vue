<script setup lang="ts">
const props = defineProps({
	for: {
		type: String,
		default: "",
	},
	text: {
		type: String,
		default: "",
	},
});

defineComponent({ name: "AtomsLabel" });
</script>

<template>
	<label :for="for" class="atoms-label">
		<slot>{{ text }}</slot>
	</label>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
