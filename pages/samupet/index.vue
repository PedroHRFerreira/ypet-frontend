<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Samupet",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesSamuPet",
});
</script>
<template>
	<TemplatesSamuPet />
</template>
