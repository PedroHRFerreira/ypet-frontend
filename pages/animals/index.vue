<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
  title: "Cadastro de animais",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

defineComponent({
	name: "PagesAnimalRegistration",
});
</script>
<template>
	<TemplatesAnimalsList />
</template>
