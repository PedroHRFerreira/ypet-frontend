<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Configurações",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesSettings",
});
</script>
<template>
	<TemplatesSettings />
</template>
