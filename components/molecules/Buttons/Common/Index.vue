<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps<{
  type?: "primary" | "secondary" | "outline" | "only";
  mode?: "normal" | "destructive";
  size?: "extra-large" | "large" | "medium" | "small" | "extra-small";
  state?: "default" | "hover" | "pressed" | "disabled" | "loading" | "success";
  text?: string;
  width?: string;
  iconLeft?: boolean;
  iconRight?: boolean;
  nameIconLeft?: string;
  nameIconRight?: string;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isStateLoading = computed(() => props.state === "loading");
const isStateSuccess = computed(() => props.state === "success");
</script>

<template>
  <button
    class="button-common"
    :class="[props.type, props.mode, props.size, props.state]"
    :style="{ width: props.width || '100%' }"
    @click="$emit('click', $event)"
    :disabled="props.state === 'disabled' || props.state === 'loading'"
  >
    <!-- ícone à esquerda -->
    <AtomsIcon
      v-if="props.iconLeft"
      class="icon-left"
      :name="props.nameIconLeft || 'arrow-left'"
      filled
    />

    <!-- loading / success -->
    <AtomsLoading
      v-if="isStateLoading || isStateSuccess"
      :state="isStateSuccess ? 'success' : 'loading'"
      color="white"
      size="small"
    />

    <!-- texto -->
    <span v-else class="text">{{ props.text || 'Button' }}</span>

    <!-- ícone à direita -->
    <AtomsIcon
      v-if="props.iconRight"
      class="icon-right"
      :name="props.nameIconRight || 'arrow-right'"
      filled
    />
  </button>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
