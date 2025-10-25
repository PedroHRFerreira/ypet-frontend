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
			const report = detailStore.adoption;

			const optionsStatus = {
				in_review: "Em análise",
				forward: "Encaminhada",
				complete: "Concluída",
				archive: "Arquivada",
			};

			return [
				{
					title: "Informações da denúncia",
					content: [
						{
							label: "Tipo de denúncia:",
							value: report?.type?.label || "N/A",
							isEnum: true,
						},
						{
							label: "Data e hora do envio:",
							value: proxy?.$formatDateTime(report?.created_at) || "N/A",
						},
						{
							label: "Localização:",
							value: `${report?.location?.address || "N/A"} (${report?.location?.latitude || "N/A"}, ${report?.location?.longitude || "N/A"})`,
						},
						{
							label: "Denunciante:",
							value: `${report?.user?.name || "N/A"} - ${report?.user?.contact || "N/A"}`,
						},
						{
							label: "Status atual:",
							value: optionsStatus[report?.status] || "N/A",
						},
						{
							label: "Mídia capturada:",
							value: report?.media?.url || "",
							isImage: true,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = route.params.id as string;
			await detailStore.fetchAdoptionById(id, {
				"with[]": ["user", "location", "media", "type"],
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
