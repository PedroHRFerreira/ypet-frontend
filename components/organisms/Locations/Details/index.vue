<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useDetailStore } from "~/stores/locations/useDetailStore";
import type { IEnum } from "~/types/global";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsLocationsDetails",
	setup() {
		const route = useRoute();
		const detailStore = useDetailStore();

		const location = computed(() => detailStore.location);

		const enumStatus: Record<number, IEnum> = {
			0: { value: 0, name: "Inativo", label: "Inativo", color: "error" },
			1: { value: 1, name: "Ativo", label: "Ativo", color: "success" },
		};

		const enumLocationType: Record<string, IEnum> = {
			pet_hotel: {
				value: "pet_hotel",
				name: "Hotel Pet",
				label: "Hotel Pet",
				color: "info",
			},
			temporary_home: {
				value: "temporary_home",
				name: "Lar Temporário",
				label: "Lar Temporário",
				color: "warning",
			},
			municipal_temporary_shelter: {
				value: "municipal_temporary_shelter",
				name: "Abrigo Temporário Municipal",
				label: "Abrigo Temporário Municipal",
				color: "info",
			},
			partner_clinics: {
				value: "partner_clinics",
				name: "Clínicas Conveniadas",
				label: "Clínicas Conveniadas",
				color: "success",
			},
			veterinary_hospital: {
				value: "veterinary_hospital",
				name: "Hospital Veterinário",
				label: "Hospital Veterinário",
				color: "info",
			},
			adopt_here: {
				value: "adopt_here",
				name: "Adote Aqui",
				label: "Adote Aqui",
				color: "primary",
			},
			shelter_protector: {
				value: "shelter_protector",
				name: "Abrigo / Protetor",
				label: "Abrigo / Protetor",
				color: "warning",
			},
		};

		const abouts = computed<AboutType[]>(() => {
			const loc = location.value;
			if (!loc) return [];

			const addr = loc.addresses[0];

			return [
				{
					title: "Informações do Local",
					content: [
						{ label: "", value: loc.picture, isImage: true },
						{ label: "Nome:", value: loc.location_name },
						{
							label: "Tipo de Local:",
							value: enumLocationType[loc.location_type],
							isEnum: true,
						},
						{ label: "Responsável:", value: loc.responsible_name },
						{
							label: "Telefone:",
							value: usePhoneFormatter11BR(String(loc.phone)) || "---",
						},
						{ label: "E-mail:", value: loc.email || "---" },
						{ label: "Status:", value: enumStatus[loc.status], isEnum: true },
						{ label: "CNPJ:", value: loc.cnpj || "---" },
						{ label: "Observações:", value: loc.notes || "---" },
					],
				},
				{
					title: "Endereço",
					content: [
						{ label: "Rua:", value: addr?.street || "---" },
						{ label: "Número:", value: addr?.number || "---" },
						{ label: "CEP:", value: addr?.zip_code || "---" },
						{ label: "Bairro:", value: addr?.district || "---" },
						{ label: "Cidade:", value: addr?.city || "---" },
						{ label: "Estado:", value: addr?.state || "---" },
						{ label: "Complemento:", value: addr?.complement || "---" },
					],
				},
			];
		});

		onMounted(async () => {
			const id = route.params.id as string;
			await detailStore.fetchLocationById(id);
		});

		return { abouts };
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
						type="only"
						:text="(item.value as IEnum)?.label || '---'"
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
