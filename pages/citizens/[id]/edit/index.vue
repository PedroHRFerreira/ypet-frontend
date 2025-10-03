<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar cidadão",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "citizens-edit",
});

defineComponent({
	name: "PagesCitizensEdit",
});
</script>

<template>
	<TemplatesCitizensEdit />
</template>
