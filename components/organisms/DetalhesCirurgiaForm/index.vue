<script setup lang="ts">
import type { PropType } from "vue";
import { computed, onMounted } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";

defineComponent({ name: "OrganismsDetalhesCirurgiaForm" });

const props = defineProps({
	modelValue: {
		type: Object as PropType<{
			tipoCirurgia: string;
			status: string;
			dataAlta: string | Date | null;
			localCirurgia: string | number;
			observacoes: string;
		}>,
		default: () => ({
			tipoCirurgia: "",
			status: "scheduled",
			dataAlta: "",
			localCirurgia: "",
			observacoes: "",
		}),
	},
});

const emit = defineEmits(["update:modelValue", "registrar-cirurgia"]);

const tipoCirurgia = computed({
	get: () => props.modelValue.tipoCirurgia,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, tipoCirurgia: v }),
});

const status = computed({
	get: () => props.modelValue.status,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, status: v }),
});

const dataAlta = computed({
	get: () => props.modelValue.dataAlta,
	set: (v: string | Date | null) =>
		emit("update:modelValue", { ...props.modelValue, dataAlta: v }),
});

const localCirurgia = computed({
	get: () => props.modelValue.localCirurgia,
	set: (v: string | number) =>
		emit("update:modelValue", { ...props.modelValue, localCirurgia: v }),
});

const observacoes = computed({
	get: () => props.modelValue.observacoes,
	set: (v: string) =>
		emit("update:modelValue", { ...props.modelValue, observacoes: v }),
});

const statusOptions = [
	{ label: "Agendado", value: "scheduled" },
	{ label: "Concluído", value: "done" },
	{ label: "Cancelado", value: "cancelled" },
];

const locationsStore = useLocationsStore();
const optionsLocations = computed(() =>
	locationsStore.locations.map((location) => ({
		id: location.id,
		text: location.location_name,
		state: "default" as "default" | "activated" | "disabled",
	})),
);

onMounted(async () => {
	await locationsStore.fetchLocations(1);
});

function onRegistrarCirurgia() {
	emit("registrar-cirurgia");
}
</script>

<template>
	<div class="organisms-detalhes-cirurgia-form">
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
						label="Tipo de cirurgia"
						:for="'tipo-cirurgia'"
						componentType="input"
						placeholder="Ex: Castração, retirada de tumor"
						v-model="tipoCirurgia"
					/>
					<MoleculesFormField
						label="Status"
						:for="'status-cirurgia'"
						componentType="select"
						placeholder="Selecione"
						:options="statusOptions"
						v-model="status as any"
					/>
				</div>

				<div class="procedures-form__row">
					<MoleculesInputDate
						v-model="dataAlta as any"
						label="Data de alta"
						name="data_alta"
						placeholder="YYYY-MM-DD"
						width="25%"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Local da Cirurgia"
						:options="optionsLocations"
						:value="localCirurgia as any"
						placeholder-text="Selecione o local"
						@item-selected="(opt) => (localCirurgia = opt?.id as any)"
					/>
				</div>

				<div class="procedures-form__row">
					<MoleculesFormField
						label="Observações"
						:for="'observacoes'"
						componentType="textarea"
						placeholder="Ex: Animal reagiu bem ao procedimento"
						v-model="observacoes"
					/>
				</div>

				<div class="procedures-form__actions">
					<MoleculesButtonsCommon
						type="primary"
						text="Registrar Cirurgia"
						icon-right
						nameIconRight="plus"
						size="medium"
						width="auto"
						@onclick="onRegistrarCirurgia"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
