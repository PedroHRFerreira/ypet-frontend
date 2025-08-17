<script lang="ts">
import { defineComponent } from "vue";
import styles from "./styles.module.scss";

// carrega todos os svg da pasta assets/icons
const icons = import.meta.glob("@/assets/icons/*.svg", { eager: true });

export default defineComponent({
  name: "AtomsIcon",
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: 24 },
    color: { type: String, default: "currentColor" },
    alt: { type: String, default: "" },
  },
  computed: {
    iconSrc(): string {
      // normaliza para kebab-case, ex: user-check
      const key = `/assets/icons/${this.name}.svg`;
      return (icons as Record<string, any>)[key]?.default || "";
    },
  },
});
</script>

<template>
  <span :class="styles.wrapper">
    <img
      v-if="iconSrc"
      :src="iconSrc"
      :alt="alt || name"
      :width="size"
      :height="size"
      :style="{ color }"
      class="icon"
    />
  </span>
</template>
