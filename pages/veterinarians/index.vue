<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
  title: "Cadastro de veterinários",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

defineComponent({
  name: "PagesVeterinarians",
});
</script>
<template>
	<TemplatesVeterinarians />
</template>
