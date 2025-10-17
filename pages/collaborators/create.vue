<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um colaborador",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "collaborators-create",
});

defineComponent({
	name: "PagesCollaboratorsCreate",
});
</script>

<template>
	<TemplatesCollaboratorsCreate />
</template>
