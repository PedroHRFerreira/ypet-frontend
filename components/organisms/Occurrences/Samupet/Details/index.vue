<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/animal-ambulance/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | undefined;
		isImage?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsOccurrencesSamupetDetails",
	setup() {
		const detailStore = useDetailStore();
		const route = useRoute();
		const { proxy } = getCurrentInstance()!;

		const abouts = computed<AboutType[]>(() => {
			const report = detailStore.samupet;

			return [
				{
					title: "Sobre o pet",
					content: [
						{
							label: "Data e hora do envio:",
							value: proxy?.$formatDateTime(report?.created_at) || "N/A",
						},
						{
							label: "Localização:",
							value: report?.location?.address
								? `${report.location.address}${report.location.latitude && report.location.longitude ? ` (${report.location.latitude}, ${report.location.longitude})` : ""}`
								: "N/A",
						},
						{
							label: "Solicitante:",
							value:
								report?.user?.name && report?.user?.contact
									? `${report.user.name} - ${report.user.contact}`
									: report?.user?.name || report?.user?.contact || "N/A",
						},
					].filter((item) => !item.isImage),
				},
			] as AboutType[];
		});

		const mediaImages = computed(() => {
			const report = detailStore.samupet;
			return report?.media?.filter((m: any) => m?.url) || [];
		});

		onMounted(async () => {
			const id = route.params.id as string;
			await detailStore.fetchById(id, {
				"with[]": ["user", "location", "media"],
			});
		});

		return {
			abouts,
			mediaImages,
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
						type="text-p5"
						:text="item.value as string"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
				</div>
			</div>
		</div>
		<div v-if="mediaImages.length > 0" class="wrapper-details__about">
			<div class="wrapper-details__about-title">
				<AtomsTypography
					type="text-p2"
					text="Mídias capturadas"
					weight="medium"
					color="var(--brand-color-dark-blue-700)"
				/>
			</div>

			<div class="wrapper-details__about-content">
				<div class="media-wrapper">
					<div class="media-grid">
						<AtomsImageCustom
							v-for="(media, idx) in mediaImages"
							:key="idx"
							:src="media.url"
							alt="Mídia capturada"
							width="150px"
							height="150px"
							object-fit="cover"
						/>
					</div>
					<AtomsTypography
						type="text-p5"
						text="As mídias foram capturadas no momento do registro e são exibidas apenas para fins de análise interna."
						weight="regular"
						color="var(--brand-color-dark-blue-500)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
