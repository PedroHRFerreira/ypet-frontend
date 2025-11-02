<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";

type Option = { label: string; value: string | number };

const props = defineProps({
	modelValue: {
		type: Object as PropType<{
			diagnostico: string;
			conduta: string;
			tipoAtendimento: string | number | undefined;
		}>,
		default: () => ({
			diagnostico: "",
			conduta: "",
			tipoAtendimento: "presencial",
		}),
	},
	tipoAtendimentoOptions: {
		type: Array as PropType<Option[]>,
		default: () => [],
	},
});

const emit = defineEmits(["update:modelValue", "anamnese", "consulta"]);

defineComponent({ name: "OrganismsDetalhesProcedimentoForm" });

const tipoAtendimentoOptionsComputed = computed<Option[]>(() => {
	return [{ label: "Presencial", value: "presencial" }];
});

const tipoAtendimentoOptionsSimple = computed(() => {
	return tipoAtendimentoOptionsComputed.value.map((opt) => ({
		id: opt.value,
		text: opt.label,
		state: "activated" as "default" | "activated" | "disabled",
	}));
});

const diagnostico = computed({
	get: () => props.modelValue.diagnostico,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, diagnostico: v }),
});

const conduta = computed({
	get: () => props.modelValue.conduta,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, conduta: v }),
});

const tipoAtendimento = computed({
	get: () => {
		const v = props.modelValue.tipoAtendimento;
		return v ?? (tipoAtendimentoOptionsComputed.value[0]?.value as any);
	},
	set: (v: string | number | undefined) =>
		emit("update:modelValue", { ...props.modelValue, tipoAtendimento: v }),
});

const showAnamneseModal = ref(false);
const anamneseForm = ref({
	queixaPrincipal: "",
	historicoAlimentarComportamental: "",
	exameFisico: "",
	condutaRecomendada: "",
	assinaturaProfissional: "",
	observacoesAdicionais: "",
});

function closeAnamneseModal() {
	showAnamneseModal.value = false;
}

function saveAnamnese() {
	emit("anamnese", { ...anamneseForm.value });
	showAnamneseModal.value = false;
}

function onAnamnese() {
	showAnamneseModal.value = true;
	emit("anamnese");
}

function onConsulta() {
	emit("consulta");
}
</script>

<template>
	<div class="organisms-detalhes-procedimento-form">
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
						label="Diagnóstico"
						:for="'diagnostico'"
						componentType="textarea"
						v-model="diagnostico"
					/>
					<MoleculesFormField
						label="Conduta recomendada"
						:for="'conduta'"
						componentType="textarea"
						v-model="conduta"
					/>
				</div>
				<div class="procedures-form__row">
					<MoleculesSelectsSimple
						max-width="25%"
						label="Tipo de atendimento"
						state="disabled"
						:options="tipoAtendimentoOptionsSimple"
						:value="tipoAtendimento as any"
						placeholder-text="Selecione"
						@item-selected="(opt) => (tipoAtendimento = opt?.id as any)"
					/>
				</div>
				<div class="procedures-form__actions">
					<MoleculesButtonsCommon
						type="secondary"
						text="Preencher Anamnese"
						size="medium"
						width="auto"
						@onclick="onAnamnese"
					/>
					<MoleculesButtonsCommon
						type="primary"
						text="Registrar Consulta"
						icon-right
						nameIconRight="plus"
						size="medium"
						width="auto"
						@onclick="onConsulta"
					/>
				</div>

				<!-- Modal de Anamnese Clínica -->
				<MoleculesModal
					:title="'Anamnese Clínica'"
					:showModal="showAnamneseModal"
					width="800px"
					height="600px"
					@close="closeAnamneseModal"
				>
					<article class="anamnese-modal">
						<div class="anamnese-modal__description">
							<AtomsTypography
								:type="'text-p5'"
								text="Registre os detalhes clínicos observados durante a consulta."
								weight="regular"
								color="var(--brand-color-dark-blue-300)"
							/>
						</div>
						<div class="anamnese-modal__content">
							<MoleculesFormField
								label="Queixa principal"
								:for="'queixa-principal'"
								componentType="input"
								placeholder="Ex: Animal apático há 3 dias, sem apetite."
								v-model="anamneseForm.queixaPrincipal"
							/>
							<MoleculesFormField
								label="Histórico alimentar e comportamental"
								:for="'historico-alimentar-comportamental'"
								componentType="input"
								placeholder="Ex: Alimentação seca 2x/dia, dorme em abrigo coletivo."
								v-model="anamneseForm.historicoAlimentarComportamental"
							/>
							<MoleculesFormField
								label="Exame físico"
								:for="'exame-fisico'"
								componentType="input"
								placeholder="Ex: Mucosas róseas, FC 120 bpm, FR 30 rpm, T 38,5ºC."
								v-model="anamneseForm.exameFisico"
							/>
							<MoleculesFormField
								label="Conduta recomendada"
								:for="'conduta-recomendada-modal'"
								componentType="input"
								placeholder="Ex: Iniciar antibiótico oral por 7 dias."
								v-model="anamneseForm.condutaRecomendada"
							/>
							<MoleculesFormField
								label="Assinatura / Identificação do profissional"
								:for="'assinatura-profissional'"
								componentType="input"
								placeholder="Ex: Dr. Ricardo – CRMV/MG 12345"
								v-model="anamneseForm.assinaturaProfissional"
							/>
							<MoleculesFormField
								label="Observações adicionais"
								:for="'observacoes-adicionais'"
								componentType="input"
								placeholder="Ex: Animal calmo, colaborativo."
								v-model="anamneseForm.observacoesAdicionais"
							/>
						</div>
						<div class="anamnese-modal__footer">
							<MoleculesButtonsCommon
								type="secondary"
								text="Cancelar"
								size="small"
								width="auto"
								@onclick="closeAnamneseModal"
							/>
							<MoleculesButtonsCommon
								type="primary"
								text="Salvar"
								size="small"
								width="auto"
								@onclick="saveAnamnese"
							/>
						</div>
					</article>
				</MoleculesModal>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
