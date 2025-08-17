<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import styles from "./styles.module.scss";

type Option = { label: string; value: string | number; disabled?: boolean };

const modelValue = defineModel<string | number | null>({ required: false });

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  placeholder?: string
  options: Option[]
  disabled?: boolean
  error?: string
  helper?: string
  clearable?: boolean
  width?: string
}>(), {
  placeholder: "Selecione...",
  disabled: false,
  error: "",
  helper: "",
  clearable: false,
  width: "100%"
});

const isOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const highlighted = ref<number>(-1);

const selected = computed(() =>
  props.options.find(o => o.value === modelValue.value) || null
);

function toggle(open?: boolean) {
  if (props.disabled) return;
  isOpen.value = open ?? !isOpen.value;
  if (isOpen.value) {
    // posiciona highlight no item selecionado ou primeiro habilitado
    highlighted.value = Math.max(
      props.options.findIndex(o => o.value === modelValue.value),
      props.options.findIndex(o => !o.disabled)
    );
    nextTick(() => listEl.value?.focus());
  }
}

function selectAt(index: number) {
  const opt = props.options[index];
  if (!opt || opt.disabled) return;
  modelValue.value = opt.value;
  isOpen.value = false;
}

function clear() {
  if (!props.clearable || props.disabled) return;
  modelValue.value = null;
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  const max = props.options.length - 1;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    do { highlighted.value = Math.min(max, highlighted.value + 1); }
    while (props.options[highlighted.value]?.disabled && highlighted.value < max);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    do { highlighted.value = Math.max(0, highlighted.value - 1); }
    while (props.options[highlighted.value]?.disabled && highlighted.value > 0);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selectAt(highlighted.value);
  } else if (e.key === "Escape") {
    isOpen.value = false;
  }
}

function onClickOutside(ev: MouseEvent) {
  if (!rootEl.value) return;
  if (!rootEl.value.contains(ev.target as Node)) isOpen.value = false;
}

onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
  <div
    ref="rootEl"
    :class="[styles.wrapper, props.disabled && styles.disabled, props.error && styles.error]"
    :style="{ width: props.width }"
  >
    <!-- Label -->
    <label v-if="props.label" :for="props.id" :class="styles.label">
      {{ props.label }}
    </label>

    <!-- Botão do select -->
    <button
      :id="props.id"
      type="button"
      :class="styles.trigger"
      :aria-haspopup="'listbox'"
      :aria-expanded="isOpen"
      :disabled="props.disabled"
      @click="toggle()"
    >
      <span :class="[styles.value, !selected && styles.placeholder]">
        {{ selected?.label ?? props.placeholder }}
      </span>

      <button
        v-if="props.clearable && selected"
        type="button"
        :class="styles.clear"
        aria-label="Limpar seleção"
        @click.stop="clear"
      >
        <AtomsIcon name="close" width="16" height="16" />
      </button>

      <AtomsIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" width="16" height="16" :class="styles.chevron" />
    </button>

    <!-- Lista -->
    <ul
      v-show="isOpen"
      ref="listEl"
      tabindex="0"
      role="listbox"
      :class="styles.listbox"
      @keydown="onKeydown"
    >
      <li
        v-for="(opt, i) in props.options"
        :key="opt.value"
        role="option"
        :aria-selected="opt.value === modelValue"
        :class="[
          styles.option,
          opt.disabled && styles.optDisabled,
          i === highlighted && styles.highlighted,
          opt.value === modelValue && styles.selected
        ]"
        @mouseenter="highlighted = i"
        @click="selectAt(i)"
      >
        <span class="text">{{ opt.label }}</span>
        <AtomsIcon v-if="opt.value === modelValue" name="check" width="16" height="16" />
      </li>
    </ul>

    <!-- Mensagens -->
    <p v-if="props.error" :class="styles.errorText">{{ props.error }}</p>
    <p v-else-if="props.helper" :class="styles.helper">{{ props.helper }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
