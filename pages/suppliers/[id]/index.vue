<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do fornecedor",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "suppliers-details",
});

defineComponent({
	name: "PagesSuppliersDetails",
});
</script>

<template>
	<TemplatesSuppliersDetails />
</template>
