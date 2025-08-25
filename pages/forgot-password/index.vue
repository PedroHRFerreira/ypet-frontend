<script setup lang="ts">
import { definePageMeta } from "#imports";
useHead({
	title: "Forgot Password",
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
	<TemplatesAuthForgotPassword />
</template>
