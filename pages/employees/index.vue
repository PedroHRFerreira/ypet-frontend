<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
	title: "Cadastro de funcionários",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "employees",
});

defineComponent({
	name: "PagesEmployees",
});
</script>
<template>
	<TemplatesEmployees />
</template>
