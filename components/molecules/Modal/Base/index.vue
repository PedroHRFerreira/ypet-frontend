<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  size?: "small" | "medium" | "large"
  persistent?: boolean
  showHeader?: boolean
  showFooter?: boolean
  title?: string
}>(), {
  size: "medium",
  persistent: false,
  showHeader: true,
  showFooter: true
})
const emit = defineEmits<{ (e:"update:modelValue", v:boolean):void }>()
const close = () => { if (!props.persistent) emit("update:modelValue", false) }
</script>

<template>
  <teleport to="body">
    <div v-if="props.modelValue" class="overlay" @click="close">
      <div class="modal" :class="props.size" @click.stop>
        <header v-if="props.showHeader" class="header">
          <h2 class="title">{{ props.title }}</h2>
          <button class="close" type="button" @click="close">
            <AtomsIcon name="close" width="20" height="20"/>
          </button>
        </header>

        <div class="body"><slot /></div>

        <footer v-if="props.showFooter" class="footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
