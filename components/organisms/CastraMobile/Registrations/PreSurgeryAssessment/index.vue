<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePreSurgeryAssessmentStore } from "~/stores/castra-mobile/registrations/usePreSurgeryAssessmentStore";
import { useDetailStore } from "~/stores/animals/useDetailStore";
import { useMucosaEnumStore } from "~/stores/Enums/useMucosaEnumStore";
import { useHydrationEnumStore } from "~/stores/Enums/useHydrationEnumStore";
import { useAbdominalPalpationEnumStore } from "~/stores/Enums/useAbdominalPalpationEnumStore";
import { usePalpationOfLymphNodesEnumStore } from "~/stores/Enums/usePalpationOfLymphNodesEnumStore";

defineOptions({
	name: "PreSurgeryAssessment",
});

// Props
interface Props {
	animalId: string | string[];
}

const props = defineProps<Props>();
const router = useRouter();

// Stores
const assessmentStore = usePreSurgeryAssessmentStore();
const animalDetailStore = useDetailStore();
const mucosaStore = useMucosaEnumStore();
const hydrationStore = useHydrationEnumStore();
const abdominalPalpationStore = useAbdominalPalpationEnumStore();
const lymphNodesStore = usePalpationOfLymphNodesEnumStore();

// Options for selects
const mucosaOptions = ref([] as IOption[]);
const hydrationOptions = ref([] as IOption[]);
const abdominalPalpationOptions = ref([] as IOption[]);
const lymphNodesOptions = ref([] as IOption[]);

// Modal states
const showSuccess = ref(false);

const modalFeedback = ref({
	success: {
		title: "Triagem salva com sucesso!",
		description: "A avaliação pré-cirúrgica foi registrada no sistema.",
		continueText: "Concluído",
		action: () => {
			showSuccess.value = false;
			assessmentStore.resetForm();
			router.push("/castra-mobile/registrations");
		},
	},
});

// Load options and animal data
onMounted(async () => {
	// Carregar opções dos enums
	const [mucosa, hydration, abdominalPalpation, lymphNodes] = await Promise.all(
		[
			mucosaStore.getOptions(),
			hydrationStore.getOptions(),
			abdominalPalpationStore.getOptions(),
			lymphNodesStore.getOptions(),
		],
	);

	mucosaOptions.value = mucosa;
	hydrationOptions.value = hydration;
	abdominalPalpationOptions.value = abdominalPalpation;
	lymphNodesOptions.value = lymphNodes;

	// Buscar dados do animal usando o store específico
	if (props.animalId) {
		await animalDetailStore.fetchAnimalById(String(props.animalId));

		// Inicializar o store de assessment com o animal_id
		assessmentStore.setFormField("animal_id", Number(props.animalId));
	}
});

const header = computed(() => ({
	title: "Formulário de Triagem do Animal",
	subtitle: "Preencha os dados para realizar a triagem pré-cirúrgica",
}));
const handleBack = () => {
	router.push("/castra-mobile?tab=schedule");
};

const handleSave = async () => {
	await assessmentStore.store();
	// Se a operação foi bem-sucedida, mostrar modal de sucesso
	if (assessmentStore.successMessage) {
		showSuccess.value = true;
	}
};

const onSelectMucosa = (option: IOption) => {
	assessmentStore.setFormField("mucosa", String(option.id));
};

const onSelectHydration = (option: IOption) => {
	assessmentStore.setFormField("hydration", String(option.id));
};

const onSelectAbdominalPalpation = (option: IOption) => {
	assessmentStore.setFormField("abdominal_palpation", String(option.id));
};

const onSelectLymphNodes = (option: IOption) => {
	assessmentStore.setFormField("palpation_of_lymph_nodes", String(option.id));
};
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-if="modalFeedback"
		key="successPreSurgeryAssessment"
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
	/>
	<section class="pre-surgery-assessment">
		<!-- Header -->
		<div class="pre-surgery-assessment__header">
			<div class="pre-surgery-assessment__header-content">
				<AtomsTypography
					type="title-h7"
					:text="header.title"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>
				<AtomsTypography
					type="text-p4"
					:text="header.subtitle"
					weight="regular"
					color="var(--brand-color-dark-blue-200)"
				/>
			</div>
		</div>

		<div class="pre-surgery-assessment__content">
			<!-- Dados do Animal -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Dados do Animal"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row">
						<MoleculesInputCommon
							label="Nome do animal"
							:value="animalDetailStore.animal.name || ''"
							:is-disabled="true"
						/>
						<MoleculesInputCommon
							label="Espécie"
							:value="animalDetailStore.animal.species?.name || ''"
							:is-disabled="true"
						/>
						<MoleculesInputCommon
							label="Porte"
							:value="animalDetailStore.animal.size?.name || ''"
							:is-disabled="true"
						/>
					</div>
					<div class="form-row">
						<MoleculesInputCommon
							label="Sexo"
							:value="animalDetailStore.animal.gender?.name || ''"
							:is-disabled="true"
						/>
						<MoleculesInputDate
							v-model="animalDetailStore.animal.birth_date"
							label="Data de nascimento"
							name="birth_date"
							min="1900-01-01"
							max="2025-12-31"
						/>
						<MoleculesInputCommon
							label="Peso (kg)"
							:value="
								animalDetailStore.animal.weight
									? String(animalDetailStore.animal.weight)
									: ''
							"
							@on-input="assessmentStore.setFormField('weight', $event)"
						/>
					</div>
				</div>
			</div>

			<!-- Exame Físico -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Exame Físico"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row">
						<MoleculesSelectsSimple
							label="Mucosa"
							:options="mucosaOptions"
							placeholder-text="Selecione"
							:message-error="
								assessmentStore.form.mucosa.errorMessages.join(', ')
							"
							@item-selected="onSelectMucosa"
						/>
						<MoleculesSelectsSimple
							label="Hidratação"
							:options="hydrationOptions"
							placeholder-text="Selecione"
							:message-error="
								assessmentStore.form.hydration.errorMessages.join(', ')
							"
							@item-selected="onSelectHydration"
						/>
						<MoleculesInputCommon
							v-model="assessmentStore.form.escore_corporal.value"
							label="Escore Corporal (1-5)"
							type-input="number"
							min="1"
							max="5"
							:message-error="
								assessmentStore.form.escore_corporal.errorMessages.join(', ')
							"
							@on-input="
								assessmentStore.setFormField('escore_corporal', $event)
							"
						/>
						<MoleculesInputCommon
							v-model="assessmentStore.form.heart_rate.value"
							label="Freq. Cardíaca (bpm)"
							type-input="number"
							@on-input="assessmentStore.setFormField('heart_rate', $event)"
						/>
						<MoleculesInputCommon
							v-model="assessmentStore.form.respiratory_rate.value"
							label="Freq. Respiratória (rpm)"
							type-input="number"
							@on-input="
								assessmentStore.setFormField('respiratory_rate', $event)
							"
						/>
					</div>
				</div>
			</div>

			<!-- Jejum -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Jejum"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row">
						<MoleculesInputCheckbox
							v-model="assessmentStore.form.adequate_fasting.value"
							label="Jejum adequado"
						/>
						<MoleculesInputCommon
							v-model="assessmentStore.form.fasting_time.value"
							label="Tempo de jejum (horas)"
							type-input="number"
							@on-input="assessmentStore.setFormField('fasting_time', $event)"
						/>
					</div>
				</div>
			</div>

			<!-- Palpação -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Palpação"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row">
						<MoleculesSelectsSimple
							label="Palpação Abdominal"
							:options="abdominalPalpationOptions"
							placeholder-text="Selecione"
							:message-error="
								assessmentStore.form.abdominal_palpation.errorMessages.join(
									', ',
								)
							"
							@item-selected="onSelectAbdominalPalpation"
						/>
						<MoleculesSelectsSimple
							label="Palpação de Linfonodos"
							:options="lymphNodesOptions"
							placeholder-text="Selecione"
							:message-error="
								assessmentStore.form.palpation_of_lymph_nodes.errorMessages.join(
									', ',
								)
							"
							@item-selected="onSelectLymphNodes"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="
								assessmentStore.form.abdominal_palpation_description.value
							"
							label="Descrição da Palpação Abdominal"
							@on-input="
								assessmentStore.setFormField(
									'abdominal_palpation_description',
									$event,
								)
							"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="
								assessmentStore.form.palpation_of_lymph_nodes_description.value
							"
							label="Localização e Descrição dos Linfonodos"
							@on-input="
								assessmentStore.setFormField(
									'palpation_of_lymph_nodes_description',
									$event,
								)
							"
						/>
					</div>
				</div>
			</div>

			<!-- Avaliação Reprodutiva -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Avaliação Reprodutiva"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row">
						<MoleculesInputCheckbox
							v-model="assessmentStore.form.vulvar_discharge.value"
							label="Secreção vulvar"
						/>
						<MoleculesInputCheckbox
							v-model="assessmentStore.form.foreskin_discharge.value"
							label="Secreção prepucial"
						/>
						<MoleculesInputCheckbox
							v-model="assessmentStore.form.ectopic_testicle.value"
							label="Testículo ectópico"
						/>
					</div>
				</div>
			</div>

			<!-- Observações e Intercorrências -->
			<div class="section">
				<AtomsTypography
					type="title-h7"
					text="Observações e Intercorrências"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>

				<div class="form-grid">
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="assessmentStore.form.obervations.value"
							label="Observações Gerais"
							@on-input="assessmentStore.setFormField('obervations', $event)"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="assessmentStore.form.transsurgical_intercurrences.value"
							label="Intercorrências Transcirúrgicas"
							@on-input="
								assessmentStore.setFormField(
									'transsurgical_intercurrences',
									$event,
								)
							"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="assessmentStore.form.measures_taken.value"
							label="Medidas Tomadas"
							@on-input="assessmentStore.setFormField('measures_taken', $event)"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="pre-surgery-assessment__footer">
			<MoleculesButtonsCommon
				type="secondary"
				text="Voltar"
				icon-left
				name-icon-left="arrow-left"
				width="auto"
				@onclick="handleBack"
			/>
			<MoleculesButtonsCommon
				type="primary"
				text="Salvar Triagem"
				width="auto"
				@onclick="handleSave"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
.pre-surgery-assessment {
	padding: 24px;
	background-color: var(--brand-color-white);
	min-height: 100vh;

	&__header {
		margin-bottom: 32px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--brand-color-dark-blue-100);

		&-content {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 32px;
		margin-bottom: 32px;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 24px;
		border-top: 1px solid var(--brand-color-dark-blue-100);
		gap: 16px;
	}

	.section {
		background-color: var(--brand-color-white);
		border: 1px solid var(--brand-color-dark-blue-100);
		border-radius: 8px;
		padding: 24px;

		> :first-child {
			margin-bottom: 20px;
		}
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 16px;
		align-items: end;

		&.full-width {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		padding: 16px;

		.form-row {
			grid-template-columns: 1fr;
		}

		&__footer {
			flex-direction: column-reverse;
			align-items: stretch;
		}
	}
}
</style>
