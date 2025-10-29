<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/castramovel/useDetailStore";

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
	name: "OrganismsOccurrencesCastramovelDetails",
	setup() {
		const detailStore = useDetailStore();
		const route = useRoute();
		const { proxy } = getCurrentInstance()!;

		const abouts = computed<AboutType[]>(() => {
			const castramovel = detailStore.castramovel;

			const optionsStatus = {
				pending: "Pendente",
				approved: "Aprovado",
				refused: "Recusada",
				in_analysis: "Para analise",
			};

			return [
				{
					title: "Informações do animal",
					content: [
						{
							label: "Nome do tutor:",
							value: castramovel?.user?.name || "---",
						},
						{
							label: "Contato do tutor:",
							value: `${usePhoneFormatter11BR(castramovel?.user?.cellphone)} - ${usePhoneFormatter11BR(castramovel?.user?.telephone)} `,
						},
						{
							label: "Contato de email:",
							value: castramovel?.user?.email,
						},
						{
							label: "Nome do animal:",
							value: castramovel?.animal?.characteristics || "---",
						},
						{
							label: "Pelo:",
							value: castramovel?.animal?.coat?.label || "---",
						},
						{
							label: "Peso:",
							value: `${castramovel?.animal?.weight}Kg` || "---",
						},
						{
							label: "Gênero:",
							value: castramovel?.animal?.gender?.label || " --- ",
						},
						{
							label: "Tamanho:",
							value: castramovel?.animal?.size?.label || " --- ",
						},
						{
							label: "Espécie:",
							value: castramovel?.animal?.species?.label || " --- ",
						},
						{
							label: "Característica:",
							value: castramovel?.animal?.species?.label || " --- ",
						},
					],
				},
				{
					title: "Informações da solicitação",
					content: [
						{
							label: "Status:",
							value: castramovel?.status?.label || "---",
						},
						{
							label: "Local da unidade:",
							value:
								castramovel?.mobile_clinic_event?.location?.location_name ||
								"---",
						},
						{
							label: "Data da solicitação:",
							value: castramovel?.mobile_clinic_event?.start_date || "---",
						},
						{
							label: "Gênero:",
							value: castramovel?.animal?.gender?.label || " --- ",
						},
						{
							label: "Tamanho:",
							value: castramovel?.animal?.size?.label || " --- ",
						},
						{
							label: "Espécie:",
							value: castramovel?.animal?.species?.label || " --- ",
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = route.params.id as string;
			await detailStore.fetchCastramovelById(id, {
				"with[]": ["user", "animal", "mobileClinicEvent"],
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
					<div v-else-if="item.isImage" class="media-wrapper">
						<AtomsImageCustom
							:src="item.value"
							alt="Mídia capturada"
							width="fit-content"
							height="150px"
							object-fit="contain"
						/>
						<AtomsTypography
							type="text-p5"
							:text="'As mídias foram capturadas no momento do registro e são exibidas apenas para fins de análise interna.'"
							weight="regular"
							color="var(--brand-color-dark-blue-500)"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
