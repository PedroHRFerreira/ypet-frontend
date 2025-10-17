<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do colaborador",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "collaborators-details",
});

defineComponent({
	name: "PagesCollaboratorsDetails",
});
</script>

<template>
	<TemplatesCollaboratorsDetails />
</template>
