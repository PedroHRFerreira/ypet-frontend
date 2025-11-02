<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

type Option = { label: string; value: string | number };

const props = defineProps({
	modelValue: {
		type: Object as PropType<{
			animalId: string | number | undefined;
			procedimento: string;
			responsavel: string;
		}>,
		default: () => ({ animalId: undefined, procedimento: "", responsavel: "" }),
	},
	animalOptions: {
		type: Array as PropType<Option[]>,
		default: () => [],
	},
});

const emit = defineEmits(["update:modelValue"]);

defineComponent({ name: "OrganismsIdentificacaoAnimalForm" });

const animalId = computed({
	get: () => props.modelValue.animalId,
	set: (v: string | number | undefined) =>
		emit("update:modelValue", { ...props.modelValue, animalId: v }),
});

const procedimento = computed({
	get: () => props.modelValue.procedimento,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, procedimento: v }),
});

const responsavel = computed({
	get: () => props.modelValue.responsavel,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, responsavel: v }),
});
</script>

<template>
	<div class="organisms-identificacao-animal-form">
		<MoleculesCardSection title="Identificação do animal">
			<MoleculesFormField
				label="Animal"
				:for="'animal'"
				componentType="select"
				:options="animalOptions"
				v-model="animalId"
			/>
			<MoleculesFormField
				label="Tipo de procedimento"
				:for="'tipo-procedimento'"
				componentType="input"
				v-model="procedimento"
			/>
			<MoleculesFormField
				label="Responsável"
				:for="'responsavel'"
				componentType="input"
				v-model="responsavel"
			/>
		</MoleculesCardSection>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
