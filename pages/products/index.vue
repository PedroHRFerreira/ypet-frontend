<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Produtos e Insumos",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesProducts",
});
</script>
<template>
	<TemplatesProducts />
</template>
