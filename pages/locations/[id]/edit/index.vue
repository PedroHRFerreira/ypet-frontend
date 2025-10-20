<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar local",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "locations-edit",
});

defineComponent({
	name: "PagesLocationsEdit",
});
</script>

<template>
	<TemplatesLocationsEdit />
</template>
