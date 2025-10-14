<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Gerenciamento de Colaboradores",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "collaborators",
});

defineComponent({
	name: "PagesCollaborators",
});
</script>
<template>
	<TemplatesCollaborators />
</template>
