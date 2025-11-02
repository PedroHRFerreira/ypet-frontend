<script setup lang="ts">
import TemplatesSettings from "@/components/templates/Settings/index.vue";

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

useHead({
	title: "Configurações",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});
</script>
<template>
	<TemplatesSettings />
</template>
