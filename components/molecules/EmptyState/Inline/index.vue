<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  icon?: string;
  title: string;
  description?: string;
  size?: "large" | "medium" | "small";
}>();

const sizeClass = props.size || "medium";
</script>

<template>
  <div class="empty-state" :class="sizeClass">
    <div v-if="props.icon" class="icon">
      <AtomsIcon :name="props.icon" width="48" height="48" />
    </div>

    <p class="title">{{ props.title }}</p>
    <p v-if="props.description" class="description">{{ props.description }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
