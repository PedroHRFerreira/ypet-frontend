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
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 25" fill="none">
    <path d="M20.6569 12.3083V14.3083L7.82854 14.3083L11.0711 17.5509L9.65686 18.9651L4 13.3082L9.65685 7.65137L11.0711 9.06558L7.82831 12.3083L20.6569 12.3083Z" :fill="currentColor"/>
  </svg>
</template>
