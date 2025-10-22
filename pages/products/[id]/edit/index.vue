<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar produto",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "products-edit",
});

defineComponent({
	name: "PagesProductsEdit",
});
</script>

<template>
	<TemplatesProductsEdit />
</template>
