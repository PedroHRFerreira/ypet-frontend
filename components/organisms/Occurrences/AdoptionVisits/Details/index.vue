<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/adoption/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsAdoptionDetails",
	setup() {
		const adoptionDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const adoption = adoptionDetailsStore.adoption;

			const gender = {
				"male": "Macho",
				"female": "Fêmea",
				"unknown": "Desconhecido"
			};

			const species = {
				"dog": "Cão",
				"cat": "Gato"
			};

			const optionsStatus = {
				"pending": "Pendente",
				'confirmed': "Confirmado",
				'rescheduled': "Remarcado",
				'completed': "Concluído",
				'canceled': "Cancelado",
			}

			return [
				{
					title: "Sobre o Animal",
					content: [
						{ label: "Nome do animal: ", value: adoption.animal?.name || "N/A" },
						{ label: "Tipo de pet:", value: species[adoption.animal?.species?.value] },
						{ label: "Sexo:", value: gender[adoption?.animal.gender.value]},
						{
							label: "Peso:",
							value: adoption.animal?.weight ? `${adoption.animal?.weight} Kg` : "N/A",
						},
						{
							label: "Data de nascimento:",
							value: proxy?.$formatDateTime(adoption.animal?.birth_date) || "N/A",
						},
						{ label: "Cor:", value: adoption.animal?.color },
						{ label: "Pelagem:", value: adoption.animal?.coat?.label},
					],
				},
				{
					title: "Dados da visita",
					content: [
						{
							label: "Cidadão:",
							value: adoption.user.name,
						},
						{
							label: "Telefone:",
							value: adoption.user.telephone,
						},
						{
							label: "email:",
							value: adoption.user.email,
						},
						{
							label: "Status adoção:",
							value: optionsStatus[adoption?.status],
						},
						{
							label: "Data da visita:",
							value: adoption?.start_date,
						},
						{
							label: "Hora da visita:",
							value: adoption?.visit_time,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await adoptionDetailsStore.fetchAdoptionById(id, {
				"with[]": ["user", "citizen","animal"],
			});
		});

		return {
			abouts,
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
						v-if="!item.isEnum && !item.isImage"
						type="text-p5"
						:text="item.value as string"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsBadges
						v-else-if="item.isEnum"
						type="text"
						:text="(item.value as IEnum)?.label || 'N/A'"
						:color="(item.value as IEnum)?.color || 'gray'"
					/>
					<AtomsImageCustom
						v-else-if="item.isImage"
						:src="item.value"
						alt="imagem usuário"
						width="fit-content"
						height="150px"
						object-fit="contain"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
