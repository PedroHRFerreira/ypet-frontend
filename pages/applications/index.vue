<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Aplicações",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	name: "applications",
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesApplications",
});
</script>

<template>
	<TemplatesApplicationsList />
</template>
