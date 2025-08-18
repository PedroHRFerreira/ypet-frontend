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
    <path d="M17.6569 16.894L19.0711 15.4798L12.0001 8.40869L4.92896 15.4798L6.34317 16.894L12.0001 11.2371L17.6569 16.894Z" :fill="currentColor"/>
  </svg>
</template>
