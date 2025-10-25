<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do atendimento",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesOccurrencesSamupetDetails",
});
</script>
<template>
	<TemplatesOccurrencesAnimalAmbulenceDetails />
</template>
