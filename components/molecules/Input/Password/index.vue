<script setup lang="ts">
import { ref, computed } from "vue";
import styles from "./styles.module.scss";

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  helper?: string
  iconLeft?: string
  showStrength?: boolean
}>(), {
  disabled: false,
  error: "",
  helper: "",
  iconLeft: "",
  showStrength: false
});

const isFocused = ref(false);
const isVisible = ref(false);

const inputType = computed(() => (isVisible.value ? "text" : "password"));

/** força simples (opcional — segue DS se existir barra de força) */
const strength = computed(() => {
  if (!props.showStrength) return 0;
  const v = modelValue?.value || "";
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return Math.min(s, 4); // 0..4
});
</script>

<template>
  <div :class="[styles.wrapper, { [styles.disabled]: props.disabled }]">
    <!-- Label -->
    <label v-if="props.label" :for="props.id" :class="styles.label">
      {{ props.label }}
    </label>

    <!-- Campo -->
    <div
      :class="[
        styles.inputContainer,
        isFocused && styles.focus,
        props.error && styles.error
      ]"
    >
      <!-- Ícone à esquerda (opcional) -->
      <span v-if="props.iconLeft" :class="styles.iconLeft">
        <AtomsIcon :name="props.iconLeft" width="18" height="18" />
      </span>

      <input
        :id="props.id"
        :type="inputType"
        v-model="modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="styles.input"
        @focus="isFocused = true"
        @blur="isFocused = false"
        autocomplete="new-password"
      />

      <!-- Toggle show/hide -->
      <button
        type="button"
        :class="styles.toggle"
        @click="isVisible = !isVisible"
        :aria-label="isVisible ? 'Ocultar senha' : 'Mostrar senha'"
        :disabled="props.disabled"
      >
        <AtomsIcon :name="isVisible ? 'eye-alt' : 'eye'" width="18" height="18" />
      </button>
    </div>

    <!-- Strength bar (opcional, se showStrength) -->
    <div v-if="props.showStrength" :class="styles.strength">
      <span :class="[styles.bar, strength >= 1 && styles.fill1]"></span>
      <span :class="[styles.bar, strength >= 2 && styles.fill2]"></span>
      <span :class="[styles.bar, strength >= 3 && styles.fill3]"></span>
      <span :class="[styles.bar, strength >= 4 && styles.fill4]"></span>
    </div>

    <!-- Mensagens -->
    <p v-if="props.error" :class="styles.errorText">{{ props.error }}</p>
    <p v-else-if="props.helper" :class="styles.helper">{{ props.helper }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
