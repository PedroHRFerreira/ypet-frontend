<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonIcon?: string;
  illustration?: string; // caminho para svg/asset
}>();

const emit = defineEmits<{
  (e: "action"): void;
}>();
</script>

<template>
  <div class="empty-state-page">
    <!-- Cabeçalho: título/esquerda + botão/direita -->
    <div class="header">
      <div class="texts">
        <h2 class="title">{{ props.title }}</h2>
        <p v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</p>
      </div>

      <button
        v-if="props.buttonLabel"
        class="action-button"
        @click="emit('action')"
      >
        <AtomsIcon
          v-if="props.buttonIcon"
          :name="props.buttonIcon"
          width="16"
          height="16"
        />
        <span>{{ props.buttonLabel }}</span>
      </button>
    </div>

    <!-- Ilustração central -->
    <div class="illustration" v-if="props.illustration">
      <img :src="props.illustration" alt="empty illustration" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
