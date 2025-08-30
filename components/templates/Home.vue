<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "TemplatesHome",
	setup() {
		const header = computed(() => {
			return {
				title: "Pagina Inicial",
				subtitle: "Bem vindo ao nosso sistema de gestão",
				buttons: [],
			};
		});

		const atualizarPeriodo = (periodo: string) => {
			// eslint-disable-next-line no-console
			console.log("Período selecionado:", periodo);
			// TODO: Aqui você pode adicionar a lógica para atualizar os dados do gráfico com base no período selecionado
		};
		return {
			header,
			atualizarPeriodo,
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
				<div class="header-actions"></div>
			</header>
			<main class="main">
				<OrganismsHomeDashboards />
				<OrganismsHomeGraphic />
			</main>
		</div>
	</div>
</template>
<style scoped lang="scss">
.wrapper-graphics {
	display: flex;
	gap: 8px;
}
</style>
