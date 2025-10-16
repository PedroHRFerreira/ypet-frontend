<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um fornecedor",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesSuppliersCreate",
});
</script>

<template>
	<TemplatesSuppliersCreate />
</template>
