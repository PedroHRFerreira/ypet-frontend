<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganismsFormWrapper",
  emits: ["onSubmit"],
});
</script>

<template>
  <form class="form-wrapper" @submit.prevent="$emit('onSubmit')">
    <header class="form-wrapper__header">
      <h2 class="form-wrapper__title">
        <slot name="title"></slot>
      </h2>
      <p class="form-wrapper__description">
        <slot name="description"></slot>
      </p>
    </header>

    <div class="form-wrapper__body">
      <slot></slot>
    </div>

    <footer class="form-wrapper__footer">
      <slot name="actions"></slot>
    </footer>
  </form>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
