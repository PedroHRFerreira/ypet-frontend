<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MoleculesDashboardCard',
  props: {
    title: {
      type: String,
      default: 'Dashboard Card',
    },
    value: {
      type: Number,
      default: 0,
    },
    difference: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'cash'
    }
  }
})
</script>

<template>
  <div class="dashboard-card">
    <div class="card-header">
      <AtomsTypography
        type="text-p5"
        weight="medium"
        :text="title"
        color="var(--brand-color-dark-blue-500)"
      />
      <button class="menu-button" aria-label="Opções">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
      </button>
    </div>

    <div class="card-body">
      <div class="data">
        <div class="value">
          {{ value }}
          <span class="difference">{{ difference }}</span>
        </div>
        <div class="icon-container">
          <AtomsIcon :name="icon" width="24px" height="24px" current-color="var(--brand-color-blue-400)" />
        </div>
      </div>
      <AtomsTypography
        type="text-p5"
        weight="regular"
        :text="subtitle"
        color="var(--brand-color-dark-blue-200)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
