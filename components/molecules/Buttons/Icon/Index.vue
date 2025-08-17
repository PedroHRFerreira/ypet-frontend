<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps<{
  type?: "primary" | "secondary" | "outline" | "only";
  mode?: "normal" | "destructive";
  size?: "extra-large" | "large" | "medium" | "small" | "extra-small";
  state?: "default" | "hover" | "pressed" | "disabled" | "loading" | "success";
  nameIcon?: string;
  currentColor?: string;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isDisabled = computed(() => props.state === "disabled");
const isStateLoading = computed(() => props.state === "loading");
const isStateSuccess = computed(() => props.state === "success");

const sizeIcon = computed(() => {
  const sizes: Record<string, string> = {
    "extra-large": "28px",
    large: "24px",
    medium: "20px",
    small: "18px",
    "extra-small": "16px",
  };
  return sizes[props.size || "medium"];
});

const iconColor = computed(() => {
  if (isDisabled.value) return "var(--greys-colors-400)";
  return props.currentColor || "currentColor";
});
</script>

<template>
  <button
    class="button-icon"
    :class="[props.type, props.mode, props.size, props.state]"
    @click="$emit('click', $event)"
    :disabled="isDisabled || isStateLoading"
  >
    <!-- loading / success -->
    <AtomsLoading
      v-if="isStateLoading || isStateSuccess"
      :state="isStateSuccess ? 'success' : 'loading'"
      color="white"
      size="small"
    />

    <!-- ícone -->
    <AtomsIcon
      v-else
      :name="props.nameIcon || 'arrow-left'"
      :width="sizeIcon"
      :height="sizeIcon"
      :current-color="iconColor"
    />
  </button>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
