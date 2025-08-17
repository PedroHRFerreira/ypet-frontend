<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title: string; size?: "medium"|"large" }>()
const emit = defineEmits<{ (e:"update:modelValue", v:boolean):void; (e:"save"):void }>()
</script>

<template>
  <MoleculesModalBase
    :model-value="props.modelValue" @update:modelValue="v => emit('update:modelValue', v)"
    :title="props.title" :size="props.size || 'large'"
  >
    <slot/>

    <template #footer>
      <MoleculesButtonsCommon type="only" text="Cancelar" @click="emit('update:modelValue', false)"/>
      <MoleculesButtonsCommon type="primary" text="Salvar" @click="emit('save')"/>
    </template>
  </MoleculesModalBase>
</template>
