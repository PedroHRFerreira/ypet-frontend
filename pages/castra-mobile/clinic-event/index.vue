<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Castramóvel - Criar Evento Clínico",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "clinic-events-create",
});

defineComponent({
	name: "PagesCastraMobileClinicEvent",
});
</script>

<template>
	<TemplatesCastraMobileClinicEventCreate />
</template>
