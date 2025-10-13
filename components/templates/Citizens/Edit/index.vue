<script lang="ts">
import { defineComponent } from "vue";
import { useDetailStore } from "~/stores/citizens/useDetailStore";
import { useEditStore } from "~/stores/citizens/useEditStore";

export default defineComponent({
	name: "TemplatesCitizensEdit",
	setup() {
		const citizenDetailsStore = useDetailStore();
		const citizenEditStore = useEditStore();
		const title = computed(() => {
			if (citizenDetailsStore.isLoading) {
				return "Carregando...";
			}

			return citizenDetailsStore.citizens
				? "# " + citizenDetailsStore.citizens.user?.name + " "
				: "";
		});
		const subtitle = computed(() => {
			if (citizenDetailsStore.isLoading) {
				return "Carregando...";
			}

			const textStart = "Editar informações do cidadão: ";
			

			return textStart + (citizenDetailsStore.citizens?.name || "");
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

		return {
			header,
			citizenDetailsStore,
			citizenEditStore,
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
				<OrganismsCitizensEdit />
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "style.module";
</style>
