<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'AtomsBaseRadio',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Array<String>, Number, Boolean, null, undefined],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.value,
      set: (val) => emit('update:modelValue', val),
    })

    return {
      internalValue,
    }
  },
})
</script>

<template>
  <label class="radio-wrapper">
    <input
      type="radio"
      class="radio-input"
      :value="value"
      :name="name"
      v-model="internalValue"
    />
    <span class="custom-radio"></span>
    <span class="radio-label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
