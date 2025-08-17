<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganismsModalWrapper",
  emits: ["onClose"],
});
</script>

<template>
  <div class="modal-overlay" @click="$emit('onClose')">
    <div class="modal-wrapper" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
