<script lang="ts">
import { definePageMeta } from "#imports";
useHead({
  title: "Register",
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
  <TemplatesAuthRegister />
</template>