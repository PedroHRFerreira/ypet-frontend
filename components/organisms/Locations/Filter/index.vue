<script lang="ts">
import { defineComponent } from "vue";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsLocationsFilter",
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const optionsTypeLocation = computed<IOption[]>(() => [
			{ id: 1, text: "Todos" },
			{ id: 2, text: "Comum" },
			{ id: 3, text: "Privado" },
		]);

		const optionsGender = computed<IOption[]>(() => [
			{ id: 1, text: "Ativo" },
			{ id: 2, text: "Inativo" },
		]);

		return {
			optionsTypeLocation,
			optionsGender,
		};
	},
});
</script>

<template>
	<MoleculesModal title="Filtros" :showModal="isVisible" is-filter>
		<article class="wrapper">
			<section class="wrapper__filter">
				<MoleculesSelectsSimple
					max-width="100%"
					label="Tipo de local"
					:options="optionsTypeLocation"
				/>
				<MoleculesSelectsSimple
					max-width="100%"
					label="Status"
					:options="optionsGender"
				/>
			</section>
			<section class="wrapper__button">
				<MoleculesButtonsCommon
					class="cancel"
					type="secondary"
					text="Limpar"
					size="small"
					mode="destructive"
				/>
				<MoleculesButtonsCommon
					class="apply"
					type="secondary"
					text="Aplicar"
					size="small"
				/>
			</section>
		</article>
	</MoleculesModal>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
