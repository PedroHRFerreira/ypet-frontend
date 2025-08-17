<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import AtomsIcon from "@/components/atoms/icon";

const props = defineProps<{
  icon: string;
  text: string;
  active?: boolean;
}>();

const emit = defineEmits<{
  (e: "onclick"): void;
}>();

const handleClick = () => {
  emit("onclick");
};
</script>

<template>
  <button
    class="sidebar-item"
    :class="{ active: props.active }"
    @click="handleClick"
  >
    <AtomsIcon :name="props.icon" width="20px" height="20px" />
    <span class="text">{{ props.text }}</span>
  </button>
</template>

<style scoped lang="scss">
@use "./styles.module.scss";
</style>
