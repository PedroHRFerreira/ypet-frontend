<script setup lang="ts">
const modelValue = defineModel<boolean>()

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  description?: string
  disabled?: boolean
  error?: string
  indeterminate?: boolean
}>(), {
  disabled: false,
  indeterminate: false,
  label: '',
  description: '',
  error: ''
})

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  // se estiver indeterminate e usuário clicar, vira checked/unchecked normal
  if (props.indeterminate) {
    // nada especial aqui; o input sai do estado indeterminate ao receber um clique
  }
  modelValue.value = target.checked
}
</script>

<template>
  <div class="checkbox-wrapper" :class="{ disabled: props.disabled, error: !!props.error }">
    <label :for="props.id" class="container">
      <span class="box">
        <input
          :id="props.id"
          type="checkbox"
          class="native"
          :checked="modelValue"
          :disabled="props.disabled"
          :aria-invalid="!!props.error"
          :aria-describedby="props.description ? `${props.id}-desc` : undefined"
          @change="onChange"
          ref="inputEl"
        />
        <!-- ícone visual -->
        <span class="control" :class="{ indeterminate: props.indeterminate, checked: modelValue }">
          <!-- checked -->
          <svg v-if="modelValue && !props.indeterminate" viewBox="0 0 24 24" class="icon">
            <path d="M20 6L9 17L4 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- indeterminate -->
          <svg v-else-if="props.indeterminate" viewBox="0 0 24 24" class="icon">
            <path d="M6 12H18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
      </span>

      <span class="texts">
        <span class="label" v-if="props.label">{{ props.label }}</span>
        <span class="description" v-if="props.description" :id="`${props.id}-desc`">
          {{ props.description }}
        </span>
      </span>
    </label>

    <p v-if="props.error" class="error-text">{{ props.error }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "MoleculesInputCheckbox",
  mounted() {
    // garante estado visual indeterminate no elemento nativo
    const el = (this.$refs.inputEl as HTMLInputElement | undefined)
    if (el) el.indeterminate = (this as any).$props.indeterminate
  },
  updated() {
    const el = (this.$refs.inputEl as HTMLInputElement | undefined)
    if (el) el.indeterminate = (this as any).$props.indeterminate
  }
}
</script>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
