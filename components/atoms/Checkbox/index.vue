<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomsCheckbox",
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array],
      required: true,
    },
    value: {
      type: [String, Number, Boolean],
      default: true,
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
    const isChecked = () => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value);
      }
      return props.modelValue === props.value || props.modelValue === true;
    };

    const onChange = (event: Event) => {
      if (props.disabled) return;

      const target = event.target as HTMLInputElement;

      if (Array.isArray(props.modelValue)) {
        const newValue = [...props.modelValue];
        if (target.checked) {
          newValue.push(props.value);
        } else {
          const index = newValue.indexOf(props.value);
          if (index > -1) newValue.splice(index, 1);
        }
        emit("update:modelValue", newValue);
      } else {
        emit("update:modelValue", target.checked ? props.value : false);
      }
    };

    return { isChecked, onChange };
  },
});
</script>

<template>
  <label
    class="checkbox"
    :class="{
      'checkbox--checked': isChecked(),
      'checkbox--disabled': disabled,
    }"
  >
    <input
      type="checkbox"
      class="checkbox__input"
      :value="value"
      :checked="isChecked()"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="checkbox__control"></span>
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
