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
  <svg :width="width" :height="height" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5858 8.56738L19 9.9816L11.9289 17.0527L4.85786 9.9816L6.27208 8.56738L11.9289 14.2242L17.5858 8.56738Z" :fill="currentColor"/>
  </svg>
</template>
