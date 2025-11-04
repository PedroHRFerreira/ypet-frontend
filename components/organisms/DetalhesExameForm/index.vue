<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

defineComponent({ name: "OrganismsDetalhesExameForm" });

const props = defineProps({
	modelValue: {
		type: Object as PropType<{
			tipoExame: string;
			resultado: string;
			dataResultado: string | Date | null;
		}>,
		default: () => ({
			tipoExame: "",
			resultado: "",
			dataResultado: "",
		}),
	},
});

const emit = defineEmits(["update:modelValue", "registrar-exame"]);

const tipoExame = computed({
	get: () => props.modelValue.tipoExame,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, tipoExame: v }),
});

const resultado = computed({
	get: () => props.modelValue.resultado,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, resultado: v }),
});

const dataResultado = computed({
	get: () => props.modelValue.dataResultado,
	set: (v: string | Date | null) =>
		emit("update:modelValue", { ...props.modelValue, dataResultado: v }),
});

function onRegistrarExame() {
	emit("registrar-exame");
}
</script>

<template>
	<div class="organisms-detalhes-exame-form">
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
						label="Tipo de exame"
						:for="'tipo-exame'"
						componentType="input"
						placeholder="Ex: Hemograma completo"
						v-model="tipoExame"
					/>
				</div>
				<div class="procedures-form__row">
					<MoleculesFormField
						label="Resultado"
						:for="'resultado'"
						componentType="textarea"
						placeholder="Ex: Leucócitos elevados; anemia leve"
						v-model="resultado"
					/>
				</div>
				<div class="procedures-form__row">
					<MoleculesInputDate
						v-model="dataResultado as any"
						label="Data do resultado"
						name="data_resultado"
						width="25%"
					/>
				</div>
				<div class="procedures-form__actions">
					<MoleculesButtonsCommon
						type="primary"
						text="Registrar Exame"
						icon-right
						nameIconRight="plus"
						size="medium"
						width="auto"
						@onclick="onRegistrarExame"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
