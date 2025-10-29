<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar Colaborador",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "collaborators-edit",
});

defineComponent({
	name: "PagesCollaboratorsEdit",
});
</script>

<template>
	<TemplatesCollaboratorsEdit />
</template>
