<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Procedimentos",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesProcedures",
});
</script>
<template>
	<TemplatesSamuPet />
</template>
