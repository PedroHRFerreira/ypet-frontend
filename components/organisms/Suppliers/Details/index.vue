<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/suppliers/useDetailStore";

type AboutType = {
	title: string;
	content: {
		label: string;
		value: string | IEnum | undefined;
		isEnum?: boolean;
	}[];
};

export default defineComponent({
	name: "OrganismsSuppliersDetails",
	setup() {
		const suppliersDetailsStore = useDetailStore();
		const abouts = computed<AboutType[]>(() => {
			const supplier = suppliersDetailsStore.supplier;

			console.log("for no estado", supplier, supplier.legal_name);
			return [
				{
					title: "Sobre o fornecedor",
					content: [
						{ label: "Nome: ", value: supplier.legal_name || "N/A" },
						{ label: "Razão Social: ", value: supplier.business_name || "N/A" },
						{ label: "CNPJ:", value: supplier?.document },
						{
							label: "Inscrição Municipal:",
							value: supplier?.municipal_registration || "N/A",
						},
						{
							label: "Inscrição Estadual:",
							value: supplier?.state_registration || "N/A",
						},
					],
				},
			] as AboutType[];
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await suppliersDetailsStore.fetchSupplierById(id, {
				"with[]": ["contacts", "addresses"],
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
						type="text-p5"
						:text="(item.value as string) || 'N/A'"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
