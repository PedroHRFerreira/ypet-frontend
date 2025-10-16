<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar fornecedor",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "suppliers-edit",
});

defineComponent({
	name: "PagesSuppliersEdit",
});
</script>

<template>
	<TemplatesSuppliersEdit />
</template>
