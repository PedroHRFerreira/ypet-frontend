<script lang="ts">
export default defineComponent({
	name: "AtomsDropdownItem",
	props: {
		state: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return ["default", "activated", "disabled"].includes(value);
			},
		},
		text: {
			type: String,
			default: "",
		},
		textColor: {
			type: String,
			default: "var(--greys-colors-800)",
		},
	},
	emits: ["on-click"],
	setup(props) {
		const isStateActivated = computed(() => {
			return props.state === "activated";
		});
		return {
			isStateActivated,
		};
	},
});
</script>
<template>
	<div :class="['wrapper-dropdown-item', state]" @click="$emit('on-click')">
		<div class="wrapper-dropdown-item__text">
			<AtomsTypography
				type="text-p5"
				weight="regular"
				:text="text"
				:color="textColor"
			/>
			<AtomsIcon
				v-if="isStateActivated"
				name="check"
				width="14px"
				height="14px"
				filled
				current-color="var(--brand-color-dark-blue-600)"
			/>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
