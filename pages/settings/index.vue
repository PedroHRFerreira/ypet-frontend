<script setup lang="ts">
import { definePageMeta, useHead } from "#imports";
import TemplatesSettings from "@/components/templates/Settings/index.vue";

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
