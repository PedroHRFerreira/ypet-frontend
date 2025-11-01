<script setup lang="ts">
import type { PropType } from "vue";
import { ref, watch, computed } from "vue";

type Option = { label: string; value: string | number };
defineOptions({ name: "ProceduresCreatePage" });
const {
	identificacao,
	detalhes,
	animalOptions,
	tipoAtendimentoOptions,
	errors,
} = defineProps({
	identificacao: {
		type: Object as PropType<{
			animalId: string | number | undefined;
			procedimento: string;
		}>,
		default: () => ({
			animalId: undefined,
			procedimento: "",
		}),
	},
	detalhes: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({
			diagnostico: "",
			conduta: "",
			tipoAtendimento: "presencial",
		}),
	},
	animalOptions: {
		type: Array as PropType<Option[]>,
		default: () => [],
	},
	tipoAtendimentoOptions: {
		type: Array as PropType<Option[]>,
		default: () => [],
	},
	errors: {
		type: Object as PropType<Record<string, string[] | string | undefined>>,
		default: () => ({}),
	},
});

const emit = defineEmits([
	"update:identificacao",
	"update:detalhes",
	"anamnese",
	"consulta",
	"registrar-exame",
	"registrar-cirurgia",
	"registrar-triagem",
]);

const onUpdateDetalhes = (v: any) => {
	emit("update:detalhes", v);
};

const onAnamnese = (payload?: any) => {
	emit("anamnese", payload);
};

const onConsulta = () => {
	emit("consulta");
};

const onRegistrarExame = () => {
	emit("registrar-exame");
};

const onRegistrarCirurgia = () => {
	emit("registrar-cirurgia");
};

const onRegistrarTriagem = () => {
	emit("registrar-triagem");
};

const animalSelectOptions = computed(() => {
	return (animalOptions as Option[]).map((a: Option & { data?: any }) => ({
		id: a.value as any,
		text: String(a.label),
		data: a?.data,
	}));
});

const onSelectAnimal = (opt: any) => {
	emit("update:identificacao", { ...identificacao, animalId: opt.id });

	const weight = opt?.data?.weight ?? opt?.data?.peso ?? null;
	if (weight !== null && weight !== undefined) {
		emit("update:detalhes", { ...detalhes, pesoAtualizado: Number(weight) });
	}
};

const procedureTabs = ref([
	{
		id: "consultas",
		name: "Consultas",
		active: identificacao.procedimento === "consultas",
	},
	{
		id: "exame",
		name: "Exame",
		active: identificacao.procedimento === "exame",
	},
	{
		id: "cirurgia",
		name: "Cirurgia",
		active: identificacao.procedimento === "cirurgia",
	},
	{
		id: "triagem",
		name: "Triagem",
		active: identificacao.procedimento === "triagem",
	},
]);

function setActiveTab(tab: { id: string; name: string; active: boolean }) {
	procedureTabs.value = procedureTabs.value.map((t) => ({
		...t,
		active: t.id === tab.id,
	}));

	emit("update:identificacao", { ...identificacao, procedimento: tab.id });
}

watch(
	() => identificacao.procedimento,
	(key) => {
		procedureTabs.value = procedureTabs.value.map((t) => ({
			...t,
			active: t.id === key,
		}));
	},
);
</script>

<template>
	<div class="wrapper-template">
		<div class="content">
			<header class="header">
				<div class="header-content">
					<AtomsTypography
						type="title-h7"
						class="header-content__title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
						text="Procedimentos"
					/>
					<AtomsTypography
						type="text-p4"
						class="header-content__subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
						text="Registre consultas, exames, cirurgias e triagens realizadas com o animal."
					/>
				</div>
			</header>

			<main class="main">
				<div class="procedures__tabs">
					<MoleculesTabs :tabs="procedureTabs" @change-tab="setActiveTab" />
				</div>

				<!-- Identificação do Animal: espelhar design de Aplicações -->
				<div class="section-card">
					<AtomsTypography
						type="text-p3"
						text="Identificação do Animal"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
					<div class="procedures-form__group">
						<MoleculesSelectsSimple
							label="Animal"
							max-width="33%"
							:options="animalSelectOptions"
							:value="identificacao.animalId as any"
							:message-error="
								(Array.isArray(errors?.animal_id)
									? errors?.animal_id?.[0]
									: (errors?.animal_id as string)) || undefined
							"
							@item-selected="onSelectAnimal"
						/>
					</div>
				</div>

				<OrganismsDetalhesExameForm
					v-if="identificacao.procedimento === 'exame'"
					:model-value="detalhes as any"
					@update:modelValue="onUpdateDetalhes"
					@registrar-exame="onRegistrarExame"
				/>
				<OrganismsDetalhesCirurgiaForm
					v-else-if="identificacao.procedimento === 'cirurgia'"
					:model-value="detalhes as any"
					@update:modelValue="onUpdateDetalhes"
					@registrar-cirurgia="onRegistrarCirurgia"
				/>
				<OrganismsDetalhesTriagemForm
					v-else-if="identificacao.procedimento === 'triagem'"
					:model-value="detalhes as any"
					@update:modelValue="onUpdateDetalhes"
					@registrar-triagem="onRegistrarTriagem"
				/>
				<OrganismsDetalhesProcedimentoForm
					v-else
					:model-value="detalhes as any"
					@update:modelValue="onUpdateDetalhes"
					:tipo-atendimento-options="tipoAtendimentoOptions"
					@anamnese="onAnamnese"
					@consulta="onConsulta"
				/>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "./styles.module";
</style>
