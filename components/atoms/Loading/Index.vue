<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  state?: "loading" | "success";
  size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
  color?: "primary" | "white" | "green" | "red";
}>();

const colors: Record<string, string> = {
  primary: "var(--brand-color-blue-700)",
  white: "#FFFFFF",
  green: "var(--succes-colors-600)",
  red: "var(--feedback-error-600)",
};
</script>

<template>
  <span :class="['loading-wrapper', size, state]">
    <!-- Spinner -->
    <svg
      v-if="state === 'loading'"
      class="spinner"
      viewBox="0 0 50 50"
    >
      <circle
        class="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
        :stroke="colors[color || 'primary']"
      />
    </svg>

    <!-- Success check -->
    <svg
      v-else-if="state === 'success'"
      class="check"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
