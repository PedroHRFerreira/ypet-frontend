<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "MoleculesInputOptionGroup",
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => IOption[],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    return {
      internalValue,
    };
  }
});
</script>

<template>
  <div class="input-option-group">
    <label class="group-label">{{ label }}</label>
    <div class="options-container">
      <AtomsBaseRadio
        v-for="option in options"
        :key="option.value"
        :label="option.text"
        :value="option.value"
        :name="name"
        v-model="internalValue"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
