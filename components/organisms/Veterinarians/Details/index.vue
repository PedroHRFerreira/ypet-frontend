<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/veterinarians/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsVeterinariansDetails",
	setup() {
		const veterinarianDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const veterinarian = veterinarianDetailsStore.veterinarian;

			return [
				{
					title: "Sobre o veterinário",
					content: [
						{
							label: "Nome completo:",
							value: veterinarian?.user?.name || "N/A",
						},
						{ label: "Cpf:", value: veterinarian?.user?.document || "N/A" },
						{ label: "CRMV:", value: veterinarian?.crmv || "N/A" },
						{ label: "Email:", value: veterinarian?.user?.email || "N/A" },
						{
							label: "Telefone/Whatsapp:",
							value:
								veterinarian?.user?.telephone ||
								veterinarian?.user?.cellphone ||
								"N/A",
						},
						{
							label: "Instituição vinculada::",
							value: veterinarian?.linked_institution || "N/A",
						},
						{
							label: "Tipo de vínculo:",
							value: veterinarian?.linked_type || "N/A",
							isEnum: true,
						},
					],
				},
				{
					title: "Permissões",
					content: [
						{
							label: "Pode acessar Castramóvel:",
							value: proxy?.$booleanToSimNao(
								veterinarian?.can_access_castro_mobile,
							),
						},
						{
							label: "Pode aplicar vacinas:",
							value: proxy?.$booleanToSimNao(veterinarian?.can_apply_vaccine),
						},
						{
							label: "Observações:",
							value: veterinarian?.observations || "N/A",
						},
						{
							label: "Status do cadastro:",
							value: veterinarian?.status?.status || "N/A",
							isEnum: true,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await veterinarianDetailsStore.find(id, {
				"with[]": ["status", "user"],
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
