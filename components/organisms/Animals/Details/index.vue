<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/animals/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsAnimalsDetails",
	setup() {
		const animalDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const animal = animalDetailsStore.animal;

			return [
				{
					title: "Sobre o pet",
					content: [
						{ label: "Nome do animal: ", value: animal?.name || "N/A" },
						{ label: "Tipo de pet:", value: animal?.species, isEnum: true },
						{ label: "Sexo:", value: animal?.gender, isEnum: true },
						{
							label: "Peso:",
							value: animal?.weight ? `${animal?.weight} Kg` : "N/A",
						},
						{
							label: "Data de nascimento:",
							value: proxy?.$formatDateTime(animal?.birth_date) || "N/A",
						},
						{ label: "Porte:", value: animal?.size, isEnum: true },
						{ label: "Cor:", value: animal?.color },
						{ label: "Pelagem:", value: animal?.coat, isEnum: true },
						{
							label: "Características específicas:",
							value: animal?.characteristics,
						},
						{ label: "Apelido:", value: animal?.surname || "N/A" },
						{ label: "Protetor:", value: "Tem que definir" },
						{ label: "Status:", value: animal?.status?.status, isEnum: true },
					],
				},
				{
					title: "Dados de entrada",
					content: [
						{
							label: "Data de entrada:",
							value: proxy?.$formatDateTime(animal?.entry_data?.entry_date),
						},
            { label: "Origem:", value: animal?.entry_data?.origin, isEnum: true },
            {
              label: "Castrado:",
              value: proxy?.$booleanToSimNao(animal?.entry_data?.castrated),
            },
            {
              label: "Vermifugado:",
              value: proxy?.$booleanToSimNao(animal?.entry_data?.dewormed),
            },
						{
							label: "Local da castração:",
							value: animal?.entry_data?.castration_site || "N/A",
						},
						{
							label: "Motivo do recolhimento:",
							value: animal?.entry_data?.collection_reason || "N/A",
						},
						{
							label: "Númerio de inscrição:",
							value: animal?.entry_data?.registration_number || "N/A",
						},
						{
							label: "Númerio do microchip:",
							value: animal?.entry_data?.microchip_number || "N/A",
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await animalDetailsStore.fetchAnimalById(id, {
				"with[]": ["status", "entryData"]
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
						v-if="!item.isEnum"
						type="text-p5"
						:text="(item.value as string) || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsBadges
						v-else
						type="text"
						:text="(item.value as IEnum)?.label || 'N/A'"
						:color="(item.value as IEnum)?.color || 'gray'"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
