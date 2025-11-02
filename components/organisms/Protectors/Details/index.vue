<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/protectors/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsProtectorsDetails",
	setup() {
		const useProtectorDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const protector = useProtectorDetailsStore.protectors;

			const gender = {
				"0": "Feminino",
				"1": "Masculino",
			};

			return [
				{
					title: "Sobre o cidadão",
					content: [
						{ label: "", value: protector.image, isImage: true },
						{ label: "Nome completo: ", value: protector.user?.name || "---" },
						{ label: "CPF:", value: protector?.document || "---" },
						{
							label: "Gênero:",
							value: gender[String(protector?.gender)] || "---",
						},
						{
							label: "Data de nascimento:",
							value: proxy?.$formatDateTime(protector?.birth_date) || "---",
						},
						{ label: "Email:", value: protector.user?.email || "---" },
						{ label: "Telefone:", value: protector.user?.telephone || "---" },
						{
							label: "Endereço:",
							value: protector.addresses[0]?.street || "---",
						},
						{
							label: "Número:",
							value: protector.addresses[0]?.number || "---",
						},
						{
							label: "Complemento:",
							value: protector.addresses[0]?.complement || "---",
						},
						{
							label: "Bairro:",
							value: protector.addresses[0]?.district || "---",
						},
						{ label: "Cidade:", value: protector.addresses[0]?.city || "---" },
						{ label: "Estado:", value: protector.addresses[0]?.state || "---" },
					],
				},
				{
					title: "Permissões",
					content: [
						{
							label: "Status:",
							value: protector?.status,
						},
						{
							label: "Observações:",
							value: protector?.observations,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await useProtectorDetailsStore.fetchProtectorById(id, {
				"with[]": ["user", "addresses"],
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
