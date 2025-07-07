<script setup lang="ts">
definePageMeta({
  title: "Home",
  description: "Welcome to the home page",
  name: "home",
	layout: "default",
	middleware: ["auth"],
});
</script>

<template>
	<TemplatesHome />
</template>
