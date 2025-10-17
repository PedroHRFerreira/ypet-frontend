<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/collaborators/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsCollaboratorsDetails",
	setup() {
		const detailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const detail = detailsStore.detail;

			return [
				{
					title: "Sobre o colaborador",
					content: [
						{ label: "Nome: ", value: detail?.user.name || "N/A" },
						{ label: "Email:", value: detail?.user.email },
						{ label: "CNPJ:", value: detail?.cnpj },
						{
							label: "Data de inicio do trabalho:",
							value: proxy?.$formatDateTime(detail?.work_started_at) || "N/A",
						},
						{
							label: "Data de termíno do trabalho:",
							value: proxy?.$formatDateTime(detail?.work_ended_at) || "N/A",
						},
						{
							label: "Observações:",
							value: detail?.observations || "N/A",
						},
						{
							label: "Status:",
							value: detail?.user.status?.status,
							isEnum: true,
						},
					],
				},
				{
					title: "Dados de bancários",
					content: [
						{
							label: "Tipo de conta:",
							value: detail?.bank_account?.account_type,
							isEnum: true,
						},
						{
							label: "Banco:",
							value: detail?.bank_account?.bank_name || "N/A",
						},
						{
							label: "Agência:",
							value: detail?.bank_account?.agency || "N/A",
						},
						{
							label: "Número da conta:",
							value: detail?.bank_account?.account_number || "N/A",
						},
						{
							label: "Titular da conta:",
							value: detail?.bank_account?.account_holder_name || "N/A",
						},
						{
							label: "Documento do titular:",
							value: detail?.bank_account?.account_holder_document || "N/A",
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await detailsStore.fetchById(id, {
				"with[]": ["user.status", "bankAccount", "user.roles"],
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
