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
    height: '16',
    width: '20',
    currentColor: 'currentColor',
  }
);
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.52508 10.4749L2.57534 5.52513L0.100464 8L7.52508 15.4246L19.8995 3.05025L17.4246 0.575378L7.52508 10.4749Z" :fill="currentColor"/>
  </svg>
</template>
