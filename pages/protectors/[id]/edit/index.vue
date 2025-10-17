<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar protetores",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "protectors-edit",
});

defineComponent({
	name: "PagesProtectorsEdit",
});
</script>

<template>
	<TemplatesProtectorsEdit />
</template>
