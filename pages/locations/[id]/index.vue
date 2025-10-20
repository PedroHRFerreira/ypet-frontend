<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do local",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "locations-details",
});

defineComponent({
	name: "PagesLocationsDetails",
});
</script>

<template>
	<TemplatesLocationsDetails />
</template>
