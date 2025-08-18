<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';

withDefaults(
  defineProps<{
    name: string;
    filled?: boolean;
    width?: string | number;
    height?: string | number;
    currentColor?: string;
  }>(),
  {
    filled: false,
    height: '24px',
    width: '24px',
    currentColor: 'currentColor',
  }
);
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12H18L15 21L9 3L6 12H2" :stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
