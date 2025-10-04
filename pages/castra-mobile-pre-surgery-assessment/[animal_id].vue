<script setup lang="ts">
definePageMeta({
	layout: "default",
	middleware: "auth",
});

const route = useRoute();
const animalId = route.params.animal_id;

// Definir meta tags da página
useSeoMeta({
	title: "Triagem Pré-Cirúrgica - YPet",
	description: "Formulário de triagem pré-cirúrgica para animais",
});
</script>

<template>
	<div class="page-pre-surgery-assessment">
		<OrganismsCastraMobileRegistrationsPreSurgeryAssessment
			:animal-id="animalId"
		/>
	</div>
</template>

<style scoped lang="scss">
.page-pre-surgery-assessment {
	width: 100%;
	min-height: 100vh;
	background-color: var(--brand-color-grey-50);
}
</style>
