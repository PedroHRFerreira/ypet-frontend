<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useMucosaEnumStore } from "~/stores/Enums/useMucosaEnumStore";
import { useHydrationEnumStore } from "~/stores/Enums/useHydrationEnumStore";
import { useAbdominalPalpationEnumStore } from "~/stores/Enums/useAbdominalPalpationEnumStore";
import { usePalpationOfLymphNodesEnumStore } from "~/stores/Enums/usePalpationOfLymphNodesEnumStore";

// Props
interface Props {
	animalId: string | string[];
}

const props = defineProps<Props>();
const router = useRouter();

// Stores
const speciesStore = useAnimalSpeciesEnumStore();
const genderStore = useGenderEnumStore();
const mucosaStore = useMucosaEnumStore();
const hydrationStore = useHydrationEnumStore();
const abdominalPalpationStore = useAbdominalPalpationEnumStore();
const lymphNodesStore = usePalpationOfLymphNodesEnumStore();

// Loading states
const isLoadingAnimal = ref(false);
const animalData = ref<any>(null);

// Form data
const formData = ref({
	// Dados do Animal (serão preenchidos pela API)
	animalName: "",
	animalSpecies: "",
	animalBreed: "",
	animalAge: "",
	animalGender: "",
	animalWeight: "",

	// Exame Físico
	mucosa: "",
	hydration: "",
	bodyScore: "3",
	heartRate: "",
	respiratoryRate: "",

	// Jejum
	adequateFasting: false,
	fastingTime: "",

	// Palpação
	abdominalPalpation: "",
	abdominalPalpationDescription: "",
	lymphNodesPalpation: "",

	// Avaliação Reprodutiva
	vulvarSecretion: false,
	prepucialSecretion: false,
	ectopicTesticle: false,

	// Observações e Intercorrências
	generalObservations: "",
	transoperativeComplications: "",
	measuresTaken: "",
});

// Options for selects
const speciesOptions = ref([] as IOption[]);
const genderOptions = ref([] as IOption[]);
const mucosaOptions = ref([] as IOption[]);
const hydrationOptions = ref([] as IOption[]);
const abdominalPalpationOptions = ref([] as IOption[]);
const lymphNodesOptions = ref([] as IOption[]);

// Fetch animal data
const fetchAnimalData = async () => {
	if (!props.animalId) return;

	try {
		isLoadingAnimal.value = true;
		const response = (await $fetch(`/api/animals/${props.animalId}`)) as any;

		if (response?.data) {
			animalData.value = response.data;
			// Preencher os dados do formulário
			formData.value.animalName = response.data.name || "";
			formData.value.animalSpecies = response.data.species?.name || "";
			formData.value.animalBreed = response.data.breed || "";
			formData.value.animalAge = response.data.birth_date || "";
			formData.value.animalGender = response.data.gender?.name || "";
			formData.value.animalWeight = response.data.weight
				? String(response.data.weight)
			: "";
		}
	} catch {
		// console.error("Erro ao buscar dados do animal:", error);
	} finally {
		isLoadingAnimal.value = false;
	}
};

// Load options and animal data
onMounted(async () => {
	// Carregar opções dos enums
	const [species, gender, mucosa, hydration, abdominalPalpation, lymphNodes] =
		await Promise.all([
			speciesStore.getOptions(),
		  genderStore.getOptions(),
		  mucosaStore.getOptions(),
		  hydrationStore.getOptions(),
		  abdominalPalpationStore.getOptions(),
		  lymphNodesStore.getOptions(),
	]);

	speciesOptions.value = species;
	genderOptions.value = gender;
	mucosaOptions.value = mucosa;
	hydrationOptions.value = hydration;
	abdominalPalpationOptions.value = abdominalPalpation;
	lymphNodesOptions.value = lymphNodes;

	// Buscar dados do animal
	await fetchAnimalData();
});

const header = computed(() => ({
	title: "Formulário de Triagem do Animal",
	subtitle: "Preencha os dados para realizar a triagem pré-cirúrgica",
}));

const handleBack = () => {
	router.push("/castra-mobile/registrations");
};

const handleSave = () => {
	// Implementar salvamento
	// console.log("Salvando dados:", formData.value);
	// Aqui você faria a chamada para a API
};

const onSelectMucosa = (option: IOption) => {
	formData.value.mucosa = String(option.id);
};

const onSelectHydration = (option: IOption) => {
	formData.value.hydration = String(option.id);
};

const onSelectAbdominalPalpation = (option: IOption) => {
	formData.value.abdominalPalpation = String(option.id);
};

const onSelectLymphNodes = (option: IOption) => {
	formData.value.lymphNodesPalpation = String(option.id);
};
</script>

<template>
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
							:value="formData.animalName"
							:is-disabled="true"
						/>
						<MoleculesInputCommon
							label="Espécie"
							:value="formData.animalSpecies"
							:is-disabled="true"
						/>
						<MoleculesInputCommon
							label="Raça"
							:value="formData.animalBreed"
							:is-disabled="true"
						/>
					</div>
					<div class="form-row">
						<MoleculesInputCommon
							label="Sexo"
							:value="formData.animalGender"
							:is-disabled="true"
						/>
            <MoleculesInputDate
              v-model="formData.animalAge"
              label="Data de nascimento"
              name="birth_date"
              placeholder="YYYY-MM-DD"
              min="1900-01-01"
              max="2025-12-31"
					/>
						<MoleculesInputCommon
							label="Peso (kg)"
							:value="formData.animalWeight"
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
							@item-selected="onSelectMucosa"
						/>
						<MoleculesSelectsSimple
							label="Hidratação"
							:options="hydrationOptions"
							placeholder-text="Selecione"
							@item-selected="onSelectHydration"
						/>
						<MoleculesInputCommon
							v-model="formData.bodyScore"
							label="Escore Corporal (1-5)"
							type-input="number"
							min="1"
							max="5"
							@on-input="formData.bodyScore = String($event)"
						/>
					</div>
					<div class="form-row">
						<MoleculesInputCommon
							label="Frequência Cardíaca (bpm)"
							v-model="formData.heartRate"
							type-input="number"
							@on-input="formData.heartRate = $event"
						/>
						<MoleculesInputCommon
							label="Frequência Respiratória (rpm)"
							v-model="formData.respiratoryRate"
							type-input="number"
							@on-input="formData.respiratoryRate = $event"
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
							v-model="formData.adequateFasting"
							label="Jejum adequado"
						/>
						<MoleculesInputCommon
							label="Tempo de jejum (horas)"
							v-model="formData.fastingTime"
							type-input="number"
							@on-input="formData.fastingTime = $event"
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
							@item-selected="onSelectAbdominalPalpation"
						/>
						<MoleculesSelectsSimple
							label="Palpação de Linfonodos"
							:options="lymphNodesOptions"
							placeholder-text="Selecione"
							@item-selected="onSelectLymphNodes"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="formData.abdominalPalpationDescription"
							label="Descrição da Palpação Abdominal"
							@on-input="formData.abdominalPalpationDescription = $event"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							v-model="formData.abdominalPalpationDescription"
							label="Localização e Descrição dos Linfonodos"
							@on-input="formData.abdominalPalpationDescription = $event"
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
							v-model="formData.vulvarSecretion"
							label="Secreção vulvar"
						/>
						<MoleculesInputCheckbox
							v-model="formData.prepucialSecretion"
							label="Secreção prepucial"
						/>
						<MoleculesInputCheckbox
							v-model="formData.ectopicTesticle"
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
							label="Observações Gerais"
							v-model="formData.generalObservations"
							@on-input="formData.generalObservations = $event"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							label="Intercorrências Transcirúrgicas"
							v-model="formData.transoperativeComplications"
							@on-input="formData.transoperativeComplications = $event"
						/>
					</div>
					<div class="form-row full-width">
						<MoleculesInputCommon
							label="Medidas Tomadas"
							v-model="formData.measuresTaken"
							@on-input="formData.measuresTaken = $event"
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
				size="medium"
				width="auto"
				@onclick="handleBack"
			/>
			<MoleculesButtonsCommon
				type="primary"
				text="Salvar Triagem"
				size="medium"
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
