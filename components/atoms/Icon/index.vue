<script lang="ts">
import { defineComponent, computed, resolveComponent } from 'vue';
import * as Icons from '@/components/atoms/Icons';

export default defineComponent({
  name: 'AtomsIcon',
  components: Icons,
  props: {
    name: { type: String, required: true },
    filled: { type: Boolean, default: false },
    width: { type: [String, Number], default: '24px' },
    height: { type: [String, Number], default: '24px' },
    currentColor: { type: String, default: 'currentColor' }
  },
  computed: {
    iconComponentName(): string {
      const name = this.name.charAt(0).toUpperCase() + this.name.slice(1);

      return `AtomsIcons${name}`;
    },
    iconComponent() {
      return resolveComponent(this.iconComponentName);
    }
  }
});
</script>

<template>
  <component
    :is="iconComponent"
    :name="name"
    :filled="filled"
    :width="width"
    :height="height"
    :currentColor="currentColor"
  />
</template>

