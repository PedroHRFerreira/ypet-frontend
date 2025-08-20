<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um animal",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesAnimalsCreate",
});
</script>

<template>
	<TemplatesAnimalsCreate />
</template>
