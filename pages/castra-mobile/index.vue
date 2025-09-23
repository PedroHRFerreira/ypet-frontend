<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Castra Móvel",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "castra-mobile",
});

defineComponent({
	name: "PagesCastraMobile",
});
</script>

<template>
	<TemplatesCastraMobile />
</template>
