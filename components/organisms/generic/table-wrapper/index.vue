<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganismsTableWrapper",
});
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead class="table__head">
        <slot name="head"></slot>
      </thead>
      <tbody class="table__body">
        <slot name="body"></slot>
      </tbody>
    </table>
    <div class="table__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
