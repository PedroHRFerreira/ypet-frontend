<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomsDropdownItem",
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const handleClick = () => {
      if (!props.disabled) {
        emit("click");
      }
    };

    return { handleClick };
  },
});
</script>

<template>
  <div
    class="dropdown-item"
    :class="{ 'dropdown-item--disabled': disabled }"
    @click="handleClick"
  >
    <AtomsIcon v-if="icon" :name="icon" size="small" class="dropdown-item__icon" />
    <AtomsTypography
      type="text-p2"
      weight="medium"
      :text="label"
      class="dropdown-item__label"
    />
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
