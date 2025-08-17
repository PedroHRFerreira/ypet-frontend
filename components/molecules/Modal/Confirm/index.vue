<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title: string; message?: string }>()
const emit = defineEmits<{ (e:"update:modelValue", v:boolean):void; (e:"confirm"):void }>()
</script>

<template>
  <MoleculesModalBase
    :model-value="props.modelValue" @update:modelValue="v => emit('update:modelValue', v)"
    size="small" :show-footer="true" :title="props.title"
  >
    <p class="message">{{ props.message }}</p>

    <template #footer>
      <MoleculesButtonsCommon type="only" text="Cancelar" @click="emit('update:modelValue', false)"/>
      <MoleculesButtonsCommon type="primary" text="Confirmar" @click="emit('confirm')"/>
    </template>
  </MoleculesModalBase>
</template>

<style scoped lang="scss">
.message { margin: 0 0 4px 0; }
</style>
