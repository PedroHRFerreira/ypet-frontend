<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do agendamento",
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
	name: "PagesCastramovelDetails",
});
</script>

<template>
	<TemplatesOccurrencesCastramovelDetails />
</template>
