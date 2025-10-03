<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastre um cidadão",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesCitizensCreate",
});
</script>

<template>
	<TemplatesCitizensCreate />
</template>
