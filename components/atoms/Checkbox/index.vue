<script lang="ts">
export default defineComponent({
	name: "AtomsCheckbox",
	props: {
		checked: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: "checkbox",
		},
	},
	emits: ["checked"],
});
</script>
<template>
	<div>
		<input
			:type="type"
			class="checkbox"
			:checked="checked"
			@click="$emit('checked')"
		/>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
