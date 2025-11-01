<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes da solicitação",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "occurrences-castramovel-details",
});

defineComponent({
	name: "PagesOccurrencesCastramovelDetails",
});
</script>

<template>
	<TemplatesOccurrencesCastramovelDetails />
</template>
