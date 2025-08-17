<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  text: string;
  to?: string;              // rota interna
  href?: string;            // link externo
  color?: "primary" | "grey" | "green";
  disabled?: boolean;
  withIcon?: boolean;
}>();

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : href ? 'a' : 'span'"
    :to="to"
    :href="href"
    :class="['link', color, { disabled }]"
    @click="$emit('click', $event)"
  >
    <span>{{ text }}</span>
    <AtomsIcon
      v-if="withIcon"
      name="arrow-right"
      width="16"
      height="16"
      :current-color="disabled ? 'var(--greys-colors-400)' : 'currentColor'"
    />
  </component>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
