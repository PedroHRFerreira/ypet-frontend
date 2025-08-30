<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Ocorrências",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesOccurrences",
});
</script>
<template>
	<TemplatesOccurrences />
</template>
