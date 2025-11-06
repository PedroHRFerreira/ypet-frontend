<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/castra-mobile/registrations/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsCastraMobileRegistrationsDetails",
	setup() {
		const detailsStore = useDetailStore();

		const abouts = computed<AboutType[]>(() => {
			const data = detailsStore.data;
			const createdAt = useDayjs(data?.created_at).format("DD/MM/YYYY");
			const schedulerAt = data?.scheduler_at
				? useDayjs(data?.scheduler_at).format("DD/MM/YYYY")
				: "N/A";
			const animalAge = useDayjs().diff(data?.animal?.birth_date, "year");
			const animalAgeText = animalAge ? `${animalAge} ano(s)` : "N/A";
			const animalWeight = data?.animal?.weight
				? `${data.animal.weight} kg`
				: "N/A";

			return [
				{
					title: "Sobre o registro",
					content: [
						{ label: "ID:", value: data?.id || "N/A" },
						{ label: "Agendador em:", value: schedulerAt },
						{ label: "Status:", value: data.status || "N/A", isEnum: true },
						{ label: "Criado em:", value: createdAt },
						{ label: "Tutor:", value: data.user?.name || "N/A" },
					],
				},
				{
					title: "Sobre o animal",
					content: [
						{ label: "ID:", value: data?.animal?.id || "N/A" },
						{
							label: "Inscrição:",
							value: data?.animal?.entry_data?.registration_number || "N/A",
						},
						{ label: "Nome do animal:", value: data?.animal?.name || "N/A" },
						{
							label: "Data do cadastro:",
							value: data?.animal?.created_at
								? useDayjs(data.animal.created_at).format("DD/MM/YYYY")
								: "N/A",
						},
						{
							label: "Tipo de pet: ",
							value: data?.animal?.species || "N/A",
							isEnum: true,
						},
						{
							label: "Sexo: ",
							value: data?.animal?.gender || "N/A",
							isEnum: true,
						},
						{
							label: "Porte: ",
							value: data?.animal?.size || "N/A",
							isEnum: true,
						},
						{ label: "Peso:", value: animalWeight },
						{ label: "Idade: ", value: animalAgeText },
						{
							label: "Status:",
							value: data?.animal?.status || "N/A",
							isEnum: true,
						},
					],
				},
			] as AboutType[];
		});

		const aboutTriage = computed<AboutType[]>(() => {
			const data = detailsStore.data;
			return [
				{
					title: "Sobre triagem",
					content: [
						{
							label: "Mucosa:",
							value: data?.pre_surgery_assessment?.mucosa || "N/A",
						},
						{
							label: "Hidratação:",
							value: data?.pre_surgery_assessment?.hydration || "N/A",
						},
						{
							label: "Escore Corporal (1-5):",
							value: data?.pre_surgery_assessment?.escore_corporal || "N/A",
						},
						{
							label: "Freq. Cardíaca (bpm):",
							value: data?.pre_surgery_assessment?.heart_rate,
						},
						{
							label: "Freq. Respiratória (rpm): ",
							value: data?.pre_surgery_assessment?.respiratory_rate || "N/A",
						},
						{
							label: "Tempo de jejum (horas): ",
							value: data?.pre_surgery_assessment?.fasting_time || "N/A",
						},
						{
							label: "Palpação Abdominal: ",
							value: data?.pre_surgery_assessment?.abdominal_palpation || "N/A",
						},
						{
							label: "Palpação de Linfonodos:",
							value: data?.pre_surgery_assessment?.palpation_of_lymph_nodes,
						},
						{
							label: "Descrição da Palpação Abdominal: ",
							value:
								data?.pre_surgery_assessment?.abdominal_palpation_description,
						},
						{
							label: "Localização e Descrição dos Linfonodos: ",
							value:
								data?.pre_surgery_assessment
									?.palpation_of_lymph_nodes_description,
						},
						{
							label: "Avaliação Reprodutiva: ",
							value: data?.pre_surgery_assessment?.vulvar_discharge,
						},
						{
							label: "Observações Gerais: ",
							value: data?.pre_surgery_assessment?.obervations,
						},
						{
							label: "Intercorrências Transcirúrgicas: ",
							value: data?.pre_surgery_assessment?.transsurgical_intercurrences,
						},
						{
							label: "Medidas Tomadas: ",
							value: data?.pre_surgery_assessment?.measures_taken,
						},
					],
				},
			];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await detailsStore.fetchById(id, {
				"with[]": ["user", "animal", "preSurgeryAssessment"],
			});
		});

		return {
			abouts,
			aboutTriage,
		};
	},
});
</script>

<template>
	<div class="wrapper-details">
		<div
			v-for="(about, key) in abouts"
			:key="key"
			class="wrapper-details__about"
		>
			<div class="wrapper-details__about-title">
				<AtomsTypography
					type="text-p2"
					:text="about.title"
					weight="medium"
					color="var(--brand-color-dark-blue-700)"
				/>
			</div>

			<div class="wrapper-details__about-content">
				<div
					v-for="(item, index) in about.content"
					:key="index"
					class="wrapper-details__about-content__item"
				>
					<AtomsTypography
						type="text-p4"
						:text="item.label"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
					<AtomsTypography
						v-if="!item.isEnum"
						type="text-p5"
						:text="(item.value as string) || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsBadges
						v-else
						:text="(item.value as IEnum)?.label || 'N/A'"
						:custom-color="(item.value as IEnum)?.color || 'light'"
					/>
				</div>
			</div>
		</div>
		<div
			v-for="(about, key) in aboutTriage"
			:key="key"
			class="wrapper-details__about"
		>
			<div class="wrapper-details__about-title">
				<AtomsTypography
					type="text-p2"
					:text="about.title"
					weight="medium"
					color="var(--brand-color-dark-blue-700)"
				/>
			</div>

			<div class="wrapper-details__about-content">
				<div
					v-for="(item, index) in about.content"
					:key="index"
					class="wrapper-details__about-content__item"
				>
					<AtomsTypography
						type="text-p4"
						:text="item.label"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
					<AtomsTypography
						v-if="!item.isEnum"
						type="text-p5"
						:text="(item.value as string) || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsBadges
						v-else
						:text="(item.value as IEnum)?.label || 'N/A'"
						:custom-color="(item.value as IEnum)?.color || 'light'"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
