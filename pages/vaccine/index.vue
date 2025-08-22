<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
  title: "Cadastro de vermífugos",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

defineComponent({
  name: "PagesVaccine",
});
</script>
<template>
	<TemplatesVaccine />
</template>
