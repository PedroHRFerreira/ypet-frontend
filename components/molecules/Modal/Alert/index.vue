<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title?: string; message: string; icon?: string }>()
const emit = defineEmits<{ (e:"update:modelValue", v:boolean):void }>()
</script>

<template>
  <MoleculesModalBase
    :model-value="props.modelValue" @update:modelValue="v => emit('update:modelValue', v)"
    size="small" :title="props.title || 'Atenção'"
  >
    <div class="content">
      <AtomsIcon v-if="props.icon" :name="props.icon" width="24" height="24"/>
      <p class="message">{{ props.message }}</p>
    </div>

    <template #footer>
      <MoleculesButtonsCommon type="primary" text="OK" @click="emit('update:modelValue', false)"/>
    </template>
  </MoleculesModalBase>
</template>

<style scoped lang="scss">
.content { display:flex; gap:8px; align-items:flex-start; }
.message { margin:0; }
</style>
