<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Detalhes do Registro",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "castra-mobile.registrations.details",
});

defineComponent({
	name: "PagesRegistrationDetails",
});
</script>

<template>
	<TemplatesCastraMobileRegistrationsDetails />
</template>
