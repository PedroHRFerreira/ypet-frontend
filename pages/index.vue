<script setup lang="ts">
useHead({
	title: "Pagina Inicial",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	description: "Bem vindo ao nosso sistama de gestão",
	name: "home",
	layout: "default",
	middleware: ["auth"],
});
</script>

<template>
	<TemplatesHome />
</template>
