<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  label?: string;
  error?: string;
  disabled?: boolean;
  day?: string | number;
  month?: string | number;
  year?: string | number;
}>();

const emit = defineEmits<{
  (e: "update:day", value: string): void;
  (e: "update:month", value: string): void;
  (e: "update:year", value: string): void;
}>();
</script>

<template>
  <div class="date-input-group" :class="{ disabled: props.disabled, error: !!props.error }">
    <label v-if="props.label" class="label">
      {{ props.label }}
    </label>

    <div class="fields">
      <!-- Dia -->
      <select
        class="select"
        :disabled="props.disabled"
        :value="props.day"
        @change="emit('update:day', $event.target.value)"
      >
        <option value="" disabled>Dia</option>
        <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
      </select>

      <!-- Mês -->
      <select
        class="select"
        :disabled="props.disabled"
        :value="props.month"
        @change="emit('update:month', $event.target.value)"
      >
        <option value="" disabled>Mês</option>
        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
      </select>

      <!-- Ano -->
      <select
        class="select"
        :disabled="props.disabled"
        :value="props.year"
        @change="emit('update:year', $event.target.value)"
      >
        <option value="" disabled>Ano</option>
        <option v-for="y in 100" :key="y" :value="1925 + y">{{ 1925 + y }}</option>
      </select>
    </div>

    <p v-if="props.error" class="error-text">{{ props.error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
