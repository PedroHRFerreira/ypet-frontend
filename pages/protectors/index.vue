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
	name: "protectors-list",
});

defineComponent({
	name: "PagesProtectors",
});
</script>
<template>
	<TemplatesProtectorsList />
</template>
