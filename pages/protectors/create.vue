<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um protetor",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesProtectorsCreate",
});
</script>

<template>
	<TemplatesProtectorsCreate />
</template>
