<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastro de cidadãos",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "citizens-list",
});

defineComponent({
	name: "PagesCitizens",
});
</script>
<template>
	<TemplatesCitizensList />
</template>
