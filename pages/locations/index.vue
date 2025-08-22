<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
  title: "Cadastro de locais",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

defineComponent({
  name: "PagesLocations",
});
</script>
<template>
	<TemplatesLocations />
</template>
