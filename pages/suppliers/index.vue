<script setup lang="ts">
import { definePageMeta } from "#imports";

useHead({
  title: "Cadastro de fornecedores",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

defineComponent({
  name: "PagesSuppliers",
});
</script>
<template>
	<TemplatesSuppliers />
</template>
