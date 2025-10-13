<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do protetor",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "protectors-details",
});

defineComponent({
	name: "PagesProtectorsDetails",
});
</script>

<template>
	<TemplatesProtectorsDetails/>
</template>
