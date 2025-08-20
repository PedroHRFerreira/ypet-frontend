<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MoleculesTabs",
  props: {
    tabs: {
      type: Array as () => ITab[],
      default: () => [],
    },
  },
  emits: ["changeTab"],
  setup(_props, { emit }) {
    const tabList = ref(_props.tabs);

    const handleTabChange = (tab: ITab) => {
      if (tab.disabled) return;

      tabList.value = tabList.value.map(t => ({
        ...t,
        active: t.id === tab.id,
      }));

      emit("changeTab", tab);
    }

    watch(() => _props.tabs, (newTabs) => {
      tabList.value = newTabs;
    });

    return {
      handleTabChange,
      tabList,
    };
  }
});
</script>

<template>
<div class="tabs">
  <button
    v-for="tab in tabList"
    :key="tab.id"
    :class="['tab', { active: tab.active, disabled: tab.disabled }]"
    @click="handleTabChange(tab)"
    type="button"
  >
    {{ tab.name }}
  </button>
</div>
</template>

<style scoped lang="scss">
@use "assets/scss/_typography.scss";

.tabs {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tab {
  display: flex;
  width: auto;
  min-width: 180px;
  max-width: 260px;
  height: 56px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 4px;
  border: 1px solid var(--brand-color-blue-500);
  box-sizing: border-box;

  @extend .text-p4, .text-p4-medium;
  color: var(--brand-color-blue-500);
  line-height: 20px;
}
.tab.disabled {
  background: var(--brand-color-blue-200);
  color: var(--brand-color-blue-500);
  cursor: not-allowed;
}
.tab.active {
  background: var(--brand-color-blue-100);
  border: none;
}
</style>