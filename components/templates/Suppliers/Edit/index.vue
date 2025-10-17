<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/suppliers/useDetailStore";
import { useEditStore } from "~/stores/suppliers/useEditStore";

export default defineComponent({
	name: "TemplatesSuppliersEdit",
	setup() {
		const supplierDetailsStore = useDetailStore();
		const supplierEditStore = useEditStore();
		const title = computed(() => {
			if (supplierDetailsStore.isLoading) {
				return "Carregando...";
			}

			return supplierDetailsStore.supplier
				? "# " + supplierDetailsStore.supplier.legal_name + " "
				: "";
		});
		const subtitle = computed(() => {
			if (supplierDetailsStore.isLoading) {
				return "Carregando...";
			}

			const textStart = "Editar informações do fornecedor: ";

			return textStart + (supplierDetailsStore.supplier?.legal_name || "");
		});
		const header = computed(() => {
			return {
				title: title.value,
				subtitle: subtitle.value,
				buttons: [
					{
						text: "Voltar",
						type: "outline",
						icon: "arrow-left",
						iconLeft: true,
						nameIconLeft: "arrow-left",
						iconRight: false,
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.back();
						},
					},
				],
			};
		});

		onMounted(async () => {
			const id = useRoute().params.id as string;
			await supplierDetailsStore.fetchSupplierById(id, {
				"with[]": ["user"],
			});
		});

		return {
			header,
			supplierDetailsStore,
			supplierEditStore,
		};
	},
});
</script>

<template>
	<div class="wrapper-template">
		<div class="content">
			<header class="header">
				<div class="header-content">
					<AtomsTypography
						type="title-h7"
						class="header-content__title"
						:text="header.title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsTypography
						type="text-p4"
						class="header-content__subtitle"
						:text="header.subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
				</div>
				<div class="header-actions">
					<MoleculesButtonsCommon
						v-for="button in header.buttons"
						:key="button.text"
						:type="button.type"
						:text="button.text"
						:icon-left="button.iconLeft"
						:icon-right="button.iconRight"
						:name-icon-left="button.nameIconLeft"
						:name-icon-right="button.nameIconRight"
						:size="button.size"
						:width="button.width"
						@onclick="button.action"
					/>
				</div>
			</header>
			<main class="main">
				<OrganismsSuppliersEdit />
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "style.module";
</style>
