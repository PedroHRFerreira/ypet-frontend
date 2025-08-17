<script setup lang="ts">
import { ref } from "vue";
import styles from "./styles.module.scss";
import type { InputProps } from "./types";

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  disabled: false,
  error: "",
  placeholder: "",
});

const modelValue = defineModel<string>();
const isFocused = ref(false);
</script>

<template>
  <div
    :class="[styles.inputWrapper, { [styles.disabled]: props.disabled }]"
  >
    <!-- Label -->
    <label v-if="props.label" :for="props.id" :class="styles.label">
      {{ props.label }}
    </label>

    <!-- Input field -->
    <div
      :class="[
        styles.inputContainer,
        isFocused && styles.focus,
        props.error && styles.error
      ]"
    >
      <span v-if="props.iconLeft" :class="styles.iconLeft">
        <Icon :name="props.iconLeft" size="small" />
      </span>

      <input
        :id="props.id"
        v-model="modelValue"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :class="styles.input"
      />

      <span v-if="props.iconRight" :class="styles.iconRight">
        <Icon :name="props.iconRight" size="small" />
      </span>
    </div>

    <!-- Helper or Error -->
    <p v-if="props.error" :class="styles.errorMessage">{{ props.error }}</p>
    <p v-else-if="props.helper" :class="styles.helper">{{ props.helper }}</p>
  </div>
</template>
