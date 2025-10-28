<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/castramovel/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsOccurrencesCastramovelDetails",
	setup() {
		const detailsStore = useDetailStore();
		const castramovel = detailsStore.report;
		const address = `${castramovel.address?.street}, ${lostPet.address?.number}${lostPet.address?.complement ? ", " + lostPet.address?.complement : ""}, ${lostPet.address?.district}, ${lostPet.address?.city}, ${lostPet.address?.state}, ${lostPet.address?.country}`;

		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const gender = {
				male: "Macho",
				female: "Fêmea",
				unknown: "Desconhecido",
			};

			const species = {
				dog: "Cão",
				cat: "Gato",
			};

			const optionsStatus = {
				lost: "Perdido",
				found: "Encontrado",
				deceased: "Óbito",
				conclude: "Concluído",
			};

			return [
				{
					title: "Sobre o Animal",
					content: [
						{
							label: "",
							value: castramovel.animal.picture ?? "---",
							isImage: true,
						},
						{
							label: "Nome do animal: ",
							value: castramovel.animal?.name || "N/A",
						},
						{
							label: "Tipo de pet:",
							value: species[castramovel.animal?.species?.value],
						},
						{ label: "Sexo:", value: gender[castramovel?.animal.gender.value] },
						{
							label: "Peso:",
							value: castramovel.animal?.weight
								? `${castramovel.animal?.weight} Kg`
								: "N/A",
						},
						{
							label: "Data de nascimento:",
							value:
								proxy?.$formatDateTime(castramovel.animal?.birth_date) || "N/A",
						},
						{ label: "Cor:", value: castramovel.animal?.color },
						{ label: "Pelagem:", value: castramovel.animal?.coat?.label },
					],
				},
				{
					title: "Sobre a perca",
					content: [
						{
							label: "Data da perca:",
							value: useDayjs(castramovel.lost_at).format("DD/MM/YYYY"),
						},
						{
							label: "Hora da perca:",
							value: castramovel.lost_time ?? "---",
						},
						{
							label: "Status:",
							value: optionsStatus[castramovel?.status.status] ?? "---",
						},
					],
				},
			] as AboutType[];
		});

		const mapUrl = computed(() => {
			if (!castramovel.address) return "";
			return `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=pt&z=15&output=embed`;
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await detailsStore.fetchCastramovelById(id, {
				"with[]": ["user", "address", "animal", "status"],
			});
		});

		return {
			abouts,
			mapUrl,
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
	<div class="wrapper-details__about" style="margin-top: 24px">
		<AtomsTypography
			type="text-p2"
			text="Última localização"
			weight="medium"
			color="var(--brand-color-dark-blue-700)"
		/>
		<iframe
			:src="mapUrl"
			width="100%"
			height="400"
			style="border: 0"
			allowfullscreen=""
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		>
		</iframe>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
