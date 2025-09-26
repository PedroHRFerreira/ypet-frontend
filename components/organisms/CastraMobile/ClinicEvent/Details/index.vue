<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/castra-mobile/clinic-events/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsCastraMobileClinicEventDetails",
	setup() {
		const detailsStore = useDetailStore();
		const abouts = computed<AboutType[]>(() => {
			const data = detailsStore.data;
			const startDate = useDayjs(data?.start_date).format("DD/MM/YYYY");
			const endDate = useDayjs(data?.end_date).format("DD/MM/YYYY");
			const period = startDate + " - " + endDate;

			return [
				{
					title: "Sobre o evento",
					content: [
						{ label: "Situação:", value: data?.status, isEnum: true },
						{ label: "Nome do evento:", value: data?.name || "N/A" },
						{ label: "Descrição:", value: data?.description || "N/A" },
						{ label: "Periodo: ", value: period },
						{ label: "Local:", value: data?.location || "N/A" },
						{ label: "Nº. De Vagas:", value: data?.max_registrations },
						{ label: "Vagas preenchidas:", value: data?.current_registrations },
						{
							label: "Espécies:",
							value: data?.species,
							isEnum: true,
						},
						{
							label: "Sexo:",
							value: data.gender || "N/A",
							isEnum: true,
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await detailsStore.fetchById(id, {
				"with[]": [],
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
