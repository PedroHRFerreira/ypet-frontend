<script lang="ts">
import { defineComponent } from "vue";
import styles from "./styles.module.scss";

export default defineComponent({
	name: "AtomsTypography",
	props: {
		as: { type: String, default: "p" },
		type: { type: String, default: "text-p1" },
		weight: { type: String, default: "regular" },
		color: { type: String, default: "var(--greys-800)" },
		text: { type: String, default: "" },
	},
	setup(props) {
		return { props, styles };
	},
});
</script>

<template>
	<component
		:is="as"
		:class="[
			styles.typography,
			styles[`typography--${props.type}`],
			styles[`typography--${props.weight}`],
		]"
		:style="{ color: props.color }"
	>
		<slot>{{ props.text }}</slot>
	</component>
</template>
