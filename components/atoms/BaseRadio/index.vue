<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomsBaseRadio",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const onChange = () => {
      if (!props.disabled) {
        emit("update:modelValue", props.value);
      }
    };

    return { onChange };
  },
});
</script>

<template>
  <label
    class="radio"
    :class="{
      'radio--checked': modelValue === value,
      'radio--disabled': disabled,
    }"
  >
    <input
      type="radio"
      class="radio__input"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="radio__control"></span>
    <span v-if="label" class="radio__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
