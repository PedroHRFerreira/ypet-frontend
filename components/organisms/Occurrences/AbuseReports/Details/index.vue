<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/report/useDetailStore";

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
	name: "OrganismsOccurrencesAbuseReportsDetails",
	setup() {
		const detailStore = useDetailStore();
		const route = useRoute();
		const { proxy } = getCurrentInstance()!;

		const abouts = computed<AboutType[]>(() => {
			const report = detailStore.report;

			const optionsStatus = {
				pending: "Pendente",
				approved: "Aprovado",
				refused: "Reprovado",
				archive: "Arquivada",
			};

			return [
				{
					title: "Informações da denúncia",
					content: [
						{
							label: "Tipo de denúncia:",
							value: report?.type || "---",
						},
						{
							label: "Data e hora do envio:",
							value: proxy?.$formatDateTime(report?.created_at) || "---",
						},
						{
							label: "Localização:",
							value: `${report?.address?.street || "N/A"} (${report?.address?.city || "N/A"}, ${report?.address?.state || "N/A"})`,
						},
						{
							label: "Denunciante:",
							value: `${report?.reporter?.name || "N/A"} - ${report?.reporter?.cellphone || "N/A"} - ${report?.reporter?.email || "N/A"}`,
						},
						{
							label: "Status atual:",
							value: optionsStatus[report?.status] || "N/A",
						},
						{
							label: "Mídia capturada:",
							value: report?.picture || "",
							isImage: true,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = route.params.id as string;
			await detailStore.fetchReportById(id, {
				"with[]": ["reporter", "address"],
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
