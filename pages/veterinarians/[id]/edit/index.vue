<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar Veterinário",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "veterinarians-edit",
});

defineComponent({
	name: "PagesVeterinariansDetails",
});
</script>

<template>
	<TemplatesVeterinariansEdit />
</template>
