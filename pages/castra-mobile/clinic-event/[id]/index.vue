<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do Evento Clínico",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "clinic-event-details",
});

defineComponent({
	name: "PagesAnimalsDetails",
});
</script>

<template>
	<TemplatesCastraMobileClinicEventDetails />
</template>
