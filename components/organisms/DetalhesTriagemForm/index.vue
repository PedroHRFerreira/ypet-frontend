<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

defineComponent({ name: "OrganismsDetalhesTriagemForm" });

const props = defineProps({
	modelValue: {
		type: Object as PropType<{
			avaliacaoClinica: string;
			temperatura: string | number;
			frequenciaCardiaca: string | number;
			pesoAtualizado: string | number;
		}>,
		default: () => ({
			avaliacaoClinica: "",
			temperatura: "",
			frequenciaCardiaca: "",
			pesoAtualizado: "",
		}),
	},
});

const emit = defineEmits(["update:modelValue", "registrar-triagem"]);

const avaliacaoClinica = computed({
	get: () => props.modelValue.avaliacaoClinica,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, avaliacaoClinica: v }),
});

const temperatura = computed({
	get: () => props.modelValue.temperatura,
	set: (v: string | number) =>
		emit("update:modelValue", { ...props.modelValue, temperatura: v }),
});

const frequenciaCardiaca = computed({
	get: () => props.modelValue.frequenciaCardiaca,
	set: (v: string | number) =>
		emit("update:modelValue", { ...props.modelValue, frequenciaCardiaca: v }),
});

const pesoAtualizado = computed({
	get: () => props.modelValue.pesoAtualizado,
	set: (v: string | number) =>
		emit("update:modelValue", { ...props.modelValue, pesoAtualizado: v }),
});

function onRegistrarTriagem() {
	emit("registrar-triagem");
}
</script>

<template>
	<div class="organisms-detalhes-triagem-form">
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Detalhes do Procedimento"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="procedures-form__group">
				<div class="procedures-form__row">
					<MoleculesFormField
						label="Avaliação clínica"
						:for="'avaliacao-clinica'"
						componentType="textarea"
						placeholder="Ex: Animal alerta, mucosas rosadas, sem sinais de dor"
						v-model="avaliacaoClinica"
					/>
				</div>
				<div class="procedures-form__row">
					<MoleculesFormField
						class="field-sm"
						label="Temperatura (ºC)"
						:for="'temperatura'"
						componentType="input"
						placeholder="Ex: 38.5"
						v-model="temperatura as any"
					/>
					<MoleculesFormField
						class="field-sm"
						label="Frequência cardíaca (bpm)"
						:for="'frequencia-cardiaca'"
						componentType="input"
						placeholder="Ex: 120"
						v-model="frequenciaCardiaca as any"
					/>
					<MoleculesFormField
						class="field-sm"
						label="Peso atualizado (kg)"
						:for="'peso-atualizado'"
						componentType="input"
						placeholder="Ex: 8.2"
						v-model="pesoAtualizado as any"
					/>
				</div>
				<div class="procedures-form__actions">
					<MoleculesButtonsCommon
						type="primary"
						text="Registrar Triagem"
						icon-right
						nameIconRight="plus"
						size="medium"
						width="auto"
						@onclick="onRegistrarTriagem"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
