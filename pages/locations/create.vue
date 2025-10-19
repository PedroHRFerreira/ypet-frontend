<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um local",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesLocationsCreate",
});
</script>

<template>
	<TemplatesLocationsCreate />
</template>
