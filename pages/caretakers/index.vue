<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastro de protetores",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
});

defineComponent({
	name: "PagesCaretakers",
});
</script>
<template>
	<TemplatesCaretakers />
</template>
