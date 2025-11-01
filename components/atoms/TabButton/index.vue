<script setup lang="ts">
const props = defineProps({
	active: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["click"]);

defineComponent({ name: "AtomsTabButton" });

function onClick(e: MouseEvent) {
	if (props.disabled) return;
	emit("click", e);
}
</script>

<template>
	<button
		class="atoms-tab-button"
		:class="[{ 'is-active': active }, { 'is-disabled': disabled }]"
		:disabled="disabled"
		@click="onClick"
	>
		<slot />
	</button>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
