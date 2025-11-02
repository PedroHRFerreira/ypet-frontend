<script setup lang="ts">
import type { PropType } from "vue";

type Tab = { key: string; label: string };

defineProps({
	tabs: {
		type: Array as PropType<Tab[]>,
		default: () => [
			{ key: "consultas", label: "Consultas" },
			{ key: "exame", label: "Exame" },
			{ key: "cirurgia", label: "Cirurgia" },
			{ key: "triagem", label: "Triagem" },
		],
	},
	modelValue: {
		type: String,
		default: "consultas",
	},
});

const emit = defineEmits(["update:modelValue"]);

defineComponent({ name: "MoleculesTabGroup" });

function setActive(key: string) {
	emit("update:modelValue", key);
}
</script>

<template>
	<AtomsTabs>
		<template #header>
			<AtomsTabButton
				v-for="t in tabs"
				:key="t.key"
				:active="t.key === modelValue"
				@click="setActive(t.key)"
			>
				{{ t.label }}
			</AtomsTabButton>
		</template>
		<div class="molecules-tab-group__content">
			<slot :active="modelValue" />
		</div>
	</AtomsTabs>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
