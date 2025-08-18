<script lang="ts">
import { defineComponent } from "vue";
import AtomsIcon from "@/components/atoms/Icon/index.vue";

export default defineComponent({
	name: "SidebarItemIndex",
	components: { AtomsIcon },
	props: {
		icon: {
			type: String,
			default: "home",
		},
		text: {
			type: String,
			default: "Home",
		},
		state: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return ["default", "hover", "actived", "disabled"].includes(value);
			},
		},
		active: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["onclick"],
});
</script>
<template>
	<div
		class="sidebar-item"
		:class="[state, { active: active }]"
		@click="$emit('onclick')"
	>
		<AtomsIcon :name="icon" width="24" height="24" />
		<AtomsTypography class="text" type="text-p5" :text="text" />
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
