<script lang="ts">
import { defineComponent, computed, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import { useDetailStore } from "~/stores/animals/useDetailStore";
import type { IEnum } from "~/types/global";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
		isImage?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsAnimalsDetails",
	setup() {
		const animalDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const animal = animalDetailsStore.animal;
			const pictureUrl = animal.entry_data?.picture || (animal as any).picture;

			return [
				{
					title: "Sobre o pet",
					content: [
						{ label: "", value: pictureUrl as any, isImage: true },
						{ label: "Nome do animal: ", value: animal?.name || "N/A" },
						{ label: "Tipo de pet:", value: animal?.species, isEnum: true },
						{ label: "Sexo:", value: animal?.gender, isEnum: true },
						{
							label: "Peso:",
							value: animal?.weight ? `${animal?.weight} Kg` : "N/A",
						},
						{
							label: "Data de nascimento:",
							value: proxy?.$formatDateOnly(animal?.birth_date) || "N/A",
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
						{
							label: "Local:",
							value: (animal as any)?.location?.location_name || "N/A",
						},
					],
				},
				{
					title: "Dados de entrada",
					content: [
						{
							label: "Data de entrada:",
							value: proxy?.$formatDateTime(animal?.entry_data?.entry_date),
						},
						{
							label: "Origem:",
							value: animal?.entry_data?.origin,
							isEnum: true,
						},
						{
							label: "Castrado:",
							value: proxy?.$booleanToSimNao(animal?.entry_data?.castrated),
						},
						{
							label: "Vermifugado:",
							value: proxy?.$booleanToSimNao(animal?.entry_data?.dewormed),
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
				"with[]": ["status", "entryData"],
			});
		});

		const optionsStatus: IEnum[] = [
			{
				value: "for_adoption",
				name: "FOR_ADOPTION",
				label: "Para Adoção",
				color: "information",
			},
			{
				value: "with_owner",
				name: "WITH_OWNER",
				label: "Com Dono",
				color: "success",
			},
			{ value: "lost", name: "LOST", label: "Perdido", color: "warning" },
			{ value: "stolen", name: "STOLEN", label: "Roubado", color: "danger" },
			{ value: "deceased", name: "DECEASED", label: "Falecido", color: "dark" },
			{
				value: "targeted_adoption",
				name: "TARGETED_ADOPTION",
				label: "Adoção Direcionada",
				color: "primary",
			},
			{
				value: "restricted",
				name: "RESTRICTED",
				label: "Restrito",
				color: "secondary",
			},
			{
				value: "in_transfer",
				name: "IN_TRANSFER",
				label: "Em Transferência",
				color: "tertiary",
			},
			{
				value: "sheltered",
				name: "SHELTERED",
				label: "Abrigado",
				color: "success",
			},
		];

		const getStatus = (status: string | undefined): IEnum => {
			return (
				optionsStatus.find((s) => s.value === status) || {
					value: "",
					name: "",
					label: "Sem status",
					color: "secondary",
				}
			);
		};

		return {
			abouts,
			getStatus,
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
						:text="(item.value as string) || 'N/A'"
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
						:src="(item.value as string) || ''"
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
