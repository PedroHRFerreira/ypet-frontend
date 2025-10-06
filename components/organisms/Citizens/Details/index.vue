<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/citizens/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsCitizensDetails",
	setup() {
		const citizensDetailsStore = useDetailStore();
		const { proxy } = getCurrentInstance()!;
		const abouts = computed<AboutType[]>(() => {
			const citizen = citizensDetailsStore.citizens;

			return [
				{
					title: "Sobre o cidadão",
					content: [
						{ label: "Nome completo: ", value: citizen.user?.name || "N/A" },
						{ label: "CPF:", value: citizen?.document },
						{ label: "Gênero:", value: citizen?.gender, isEnum: true },
						{
							label: "Data de nascimento:",
							value: proxy?.$formatDateTime(citizen?.birth_date) || "N/A",
						},
						{ label: "Email:", value: citizen.user?.email },
						{ label: "Telefone:", value: citizen.user?.telephone },
						{ label: "Endereço:", value: citizen.addresses[0].street },
						{
							label: "Número:",
							value: citizen.addresses[0].number,
						},
						{
							label: "Complemento:",
							value: citizen.addresses[0].complement || "N/A",
						},
						{ label: "Bairro:", value: citizen.addresses[0].district },
						{ label: "Cidade:", value: citizen.addresses[0].city },
						{ label: "Estado:", value: citizen.addresses[0].state },
					],
				},
				{
					title: "Permissões",
					content: [
						{
							label: "Pode denunciar maus tratos:",
							value: proxy?.$booleanToSimNao(citizen?.can_report_abuse),
						},
						{
							label: "Pode acessar Castramóvel:",
							value: proxy?.$booleanToSimNao(citizen?.can_mobile_castration),
						},
						{
							label: "Status:",
							value: citizen?.status,
							isEnum: true,
						},
						{
							label: "Observações:",
							value: "",
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await citizensDetailsStore.fetchCitizenById(id, {
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
