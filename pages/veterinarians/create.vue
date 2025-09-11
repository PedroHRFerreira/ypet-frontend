<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um veterinário",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesVeterinariansCreate",
});
</script>

<template>
	<TemplatesVeterinariansCreate />
</template>
