<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganismsLayoutWrapper",
});
</script>

<template>
  <div class="layout">
    <slot name="sidebar"></slot>
    <div class="layout__main">
      <slot name="header"></slot>
      <main class="layout__content">
        <slot></slot>
      </main>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
