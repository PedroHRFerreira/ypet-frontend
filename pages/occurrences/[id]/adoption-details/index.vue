<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes da adoção",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "occurrences-adoption-details",
});

defineComponent({
	name: "PagesAdoptionDetails",
});
</script>

<template>
	<TemplatesOccurrencesAdoptionDetails />
</template>
