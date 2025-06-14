<script lang="ts">
import { definePageMeta } from "#imports";
useHead({
	title: "Login",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "access",
	middleware: ["guest"],
});
</script>
<template>
	<TemplatesLogin />
</template>
