<script setup lang="ts">
import Icon from "@/components/atoms/Icon";
import styles from "./styles.module.scss";

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<{
  id?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
}>(), {
  placeholder: "Buscar...",
  disabled: false,
  clearable: true
});

function clear() {
  modelValue.value = "";
}
</script>

<template>
  <div :class="[styles.wrapper, props.disabled && styles.disabled]">
    <Icon name="search" size="small" :class="styles.iconLeft" />

    <input
      :id="props.id"
      type="text"
      v-model="modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="styles.input"
    />

    <button
      v-if="props.clearable && modelValue"
      type="button"
      :class="styles.clearBtn"
      @click="clear"
    >
      <Icon name="close" size="small" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
