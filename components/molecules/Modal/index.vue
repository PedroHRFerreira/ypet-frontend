<script setup lang="ts">
import Icon from "@/components/atoms/Icon";
import styles from "./styles.module.scss";

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: string | number
  persistent?: boolean
}>(), {
  modelValue: false,
  width: "480px",
  persistent: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
}>();

function close() {
  if (!props.persistent) {
    emit("update:modelValue", false);
    emit("close");
  }
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.modelValue" :class="styles.overlay" @click="close">
      <div
        :class="styles.modal"
        :style="{ width: typeof props.width === 'number' ? props.width + 'px' : props.width }"
        @click.stop
      >
        <header v-if="props.title" :class="styles.header">
          <h2 :class="styles.title">{{ props.title }}</h2>
          <button type="button" :class="styles.closeBtn" @click="close">
            <Icon name="close" size="medium" />
          </button>
        </header>

        <div :class="styles.body">
          <slot />
        </div>

        <footer v-if="$slots.footer" :class="styles.footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
