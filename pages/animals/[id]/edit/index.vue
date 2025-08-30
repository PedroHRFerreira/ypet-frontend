<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar animal",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "animals-edit",
});

defineComponent({
	name: "PagesAnimalsDetails",
});
</script>

<template>
	<TemplatesAnimalsEdit />
</template>
