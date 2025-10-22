<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um produto",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesProductsCreate",
});
</script>

<template>
	<TemplatesProductsCreate />
</template>
