<script setup lang="ts">
import styles from "./styles.module.scss";

export type Option = {
  label: string
  value: string | number
  disabled?: boolean
};

const modelValue = defineModel<string | number | (string | number)[]>();

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  type?: "radio" | "checkbox"
  options: Option[]
  error?: string
  helper?: string
  disabled?: boolean
}>(), {
  type: "radio",
  error: "",
  helper: "",
  disabled: false
});

function isChecked(opt: Option) {
  if (props.type === "checkbox") {
    return Array.isArray(modelValue.value) && modelValue.value.includes(opt.value);
  }
  return modelValue.value === opt.value;
}

function toggle(opt: Option) {
  if (props.disabled || opt.disabled) return;

  if (props.type === "checkbox") {
    const arr = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
    if (arr.includes(opt.value)) {
      modelValue.value = arr.filter(v => v !== opt.value);
    } else {
      arr.push(opt.value);
      modelValue.value = arr;
    }
  } else {
    modelValue.value = opt.value;
  }
}
</script>

<template>
  <div :class="[styles.wrapper, { [styles.disabled]: props.disabled }]">
    <label v-if="props.label" :class="styles.label">{{ props.label }}</label>

    <div :class="styles.group">
      <label
        v-for="opt in props.options"
        :key="opt.value"
        :class="[
          styles.option,
          isChecked(opt) && styles.checked,
          opt.disabled && styles.optDisabled
        ]"
      >
        <input
          v-if="props.type === 'radio'"
          type="radio"
          :value="opt.value"
          :checked="isChecked(opt)"
          :disabled="props.disabled || opt.disabled"
          @change="toggle(opt)"
        />
        <input
          v-else
          type="checkbox"
          :value="opt.value"
          :checked="isChecked(opt)"
          :disabled="props.disabled || opt.disabled"
          @change="toggle(opt)"
        />
        <span :class="styles.box"></span>
        <span :class="styles.text">{{ opt.label }}</span>
      </label>
    </div>

    <p v-if="props.error" :class="styles.error">{{ props.error }}</p>
    <p v-else-if="props.helper" :class="styles.helper">{{ props.helper }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
