<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Editar evento clínico",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "clinic-events-edit",
});

defineComponent({
	name: "PagesClinicEventsEdit",
});
</script>

<template>
	<TemplatesCastraMobileClinicEventEdit />
</template>
