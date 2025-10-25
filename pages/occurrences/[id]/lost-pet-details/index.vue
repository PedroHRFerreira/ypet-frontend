<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes da pet perdido",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "occurrences-lost-pet-details",
});

defineComponent({
	name: "PagesOccurrencesLostPetDetails",
});
</script>

<template>
	<TemplatesOccurrencesLostPetDetails />
</template>
