<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Nova aplicação",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesApplicationsCreate",
});
</script>

<template>
	<TemplatesApplicationsCreate />
</template>
