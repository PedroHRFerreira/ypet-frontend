<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do Veterinário",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "veterinarians-details",
});

defineComponent({
	name: "PagesVeterinariansDetails",
});
</script>

<template>
	<TemplatesVeterinariansDetails />
</template>
