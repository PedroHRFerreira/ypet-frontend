<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do cidadão",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "citizens-details",
});

defineComponent({
	name: "PagesCitizensDetails",
});
</script>

<template>
	<TemplatesCitizensDetails />
</template>
