<template>
	<div class="page-procedure-create">
		<div v-if="errorMessage" class="error-banner">
			{{ errorMessage }}
		</div>
		<TemplatesProcedureCreate
			:identificacao="identificacao"
			:detalhes="detalhes"
			:animal-options="animalOptions"
			:tipo-atendimento-options="tipoAtendimentoOptions"
			:errors="fieldErrors as any"
			@update:identificacao="(v) => Object.assign(identificacao, v)"
			@update:detalhes="(v) => Object.assign(detalhes, v)"
			@anamnese="onAnamnese"
			@consulta="onRegistrarConsulta"
			@registrar-exame="onRegistrarExame"
			@registrar-cirurgia="onRegistrarCirurgia"
			@registrar-triagem="onRegistrarTriagem"
		/>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import TemplatesProcedureCreate from "~/components/templates/Procedures/Create/index.vue";
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({ layout: "default" });

type Option = { label: string; value: string | number };

const identificacao = reactive<{
	animalId: string | number | undefined;
	procedimento: string;
}>({
	animalId: undefined,
	procedimento: "consultas",
});

const detalhes = reactive<Record<string, any>>({
	diagnostico: "",
	conduta: "",
	tipoAtendimento: "presencial",
});

const animalOptions = ref<Option[]>([]);
const tipoAtendimentoOptions = ref<Option[]>([
	{ label: "Presencial", value: "presencial" },
	{ label: "Teleconsulta", value: "teleconsulta" },
]);

const router = useRouter();
const errorMessage = ref("");
const fieldErrors = ref<Record<string, string[]>>({});

await useFetch("/api/animals", {
	query: { page: 1, pageSize: 50 },
	onResponse({ response }) {
		const raw = response._data as any;
		const list = Array.isArray(raw?.data?.data)
			? raw?.data?.data
			: (raw?.data ?? []);
		animalOptions.value = list.map((a: any) => ({
			label: `${a.id} - ${a.name}${a.species?.label ? ` (${a.species.label})` : ""}`,
			value: a.id,
		}));
	},
	onResponseError({ response }) {
		console.error("Erro ao carregar animais", response?._data ?? response);
	},
});

const anamnese = ref<any | null>(null);

function onAnamnese(data?: any) {
	if (data) {
		anamnese.value = {
			main_complaint: data.queixaPrincipal ?? "",
			history: data.historicoAlimentarComportamental ?? "",
			physical_exam: data.exameFisico ?? "",
			diagnosis: detalhes.diagnostico ?? "",
			conduct: data.condutaRecomendada ?? detalhes.conduta ?? "",
			notes: data.observacoesAdicionais ?? "",
		};
	}
}

const mapType = (t: string) => {
	switch (t) {
		case "consultas":
			return "consultation";
		case "exame":
			return "exam";
		case "cirurgia":
			return "surgery";
		case "triagem":
			return "triage";
		default:
			return "consultation";
	}
};

const currentUserId = computed(
	() => useAuthToken().getUserCookie()?.id ?? null,
);

const todayISO = () => new Date().toISOString().slice(0, 10);

const buildExtraData = (type: string) => {
	if (type === "exam") {
		return {
			exam_type: detalhes.tipoExame ?? "",
			exam_result: detalhes.resultado ?? "",
			exam_result_date: detalhes.dataResultado ?? "",
		};
	}
	if (type === "surgery") {
		return {
			surgery_type: detalhes.tipoCirurgia ?? "",
		};
	}
	if (type === "triage") {
		return {
			clinical_assessment: detalhes.avaliacaoClinica ?? "",
			temperature: detalhes.temperatura ?? "",
			heart_rate: detalhes.frequenciaCardiaca ?? "",
			weight: detalhes.pesoAtualizado ?? "",
		};
	}
	return {
		attendance_type: detalhes.tipoAtendimento ?? "presencial",
	};
};

const buildProcedurePayload = (typeKey: string) => {
	const type = mapType(typeKey);
	const payload: any = {
		animal_id: identificacao.animalId,
		location_id: type === "surgery" ? (detalhes.localCirurgia ?? null) : null,
		type,
		status: type === "surgery" ? (detalhes.status ?? "scheduled") : "scheduled",
		date: todayISO(),
		responsible_id: currentUserId.value,
		diagnosis: detalhes.diagnostico ?? "",
		outcome: detalhes.conduta ?? "",
		discharge_date: type === "surgery" ? (detalhes.dataAlta ?? "") : "",
		notes: type === "surgery" ? (detalhes.observacoes ?? "") : "",
		extra_data: buildExtraData(type),
	};

	if (type === "consultation" && anamnese.value) {
		payload.anamnesis = { ...anamnese.value };
	}

	return payload;
};

async function submitProcedure(typeKey: string) {
	const payload = buildProcedurePayload(typeKey);
	let succeeded = false;
	await useFetch("/api/procedures", {
		method: "POST",
		body: payload,
		onResponse({ response }) {
			const data = (response?._data as any) || {};
			const status = data?.status ?? response?.status;
			if (data?.type === "error") {
				errorMessage.value =
					data?.message || "Erro ao processar a solicitação.";
				fieldErrors.value = (data?.errors as Record<string, string[]>) || {};
				return;
			}

			if (status === 200) {
				succeeded = true;
				router.push("/procedures");
				errorMessage.value = "";
				fieldErrors.value = {};
			}
		},
		onResponseError({ response }) {
			const data = (response?._data as any) || {};
			errorMessage.value = data?.message || "Erro ao registrar procedimento.";
			fieldErrors.value = (data?.errors as Record<string, string[]>) || {};
		},
	});
	return succeeded;
}

async function onRegistrarExame() {
	const ok = await submitProcedure("exame");
	if (ok) {
		Object.assign(detalhes, {
			tipoExame: "",
			resultado: "",
			dataResultado: "",
		});
	}
}

async function onRegistrarCirurgia() {
	const ok = await submitProcedure("cirurgia");
	if (ok) {
		Object.assign(detalhes, {
			tipoCirurgia: "",
			status: "scheduled",
			dataAlta: "",
			localCirurgia: "",
			observacoes: "",
		});
	}
}

async function onRegistrarTriagem() {
	const ok = await submitProcedure("triagem");
	if (ok) {
		Object.assign(detalhes, {
			avaliacaoClinica: "",
			temperatura: "",
			frequenciaCardiaca: "",
			pesoAtualizado: "",
		});
	}
}

async function onRegistrarConsulta() {
	const ok = await submitProcedure("consultas");
	if (ok) {
		Object.assign(detalhes, {
			diagnostico: "",
			conduta: "",
			tipoAtendimento: "presencial",
		});
	}
}
</script>

<style scoped>
.page-procedure-create {
	width: 100%;
}
.error-banner {
	margin: 12px 0 16px;
	padding: 12px 16px;
	border: 1px solid var(--danger-colors-700);
	border-radius: 6px;
	color: var(--danger-colors-700);
	background: color-mix(in oklab, var(--danger-colors-700) 8%, white);
}
</style>
