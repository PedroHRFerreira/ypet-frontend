<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do animal",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "animals-details",
});

defineComponent({
	name: "PagesAnimalsDetails",
});
</script>

<template>
	<TemplatesAnimalsDetails />
</template>
