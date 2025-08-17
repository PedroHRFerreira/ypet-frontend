<script setup lang="ts">
import AtomsIcon from "@/components/atoms/icon";
import MoleculesSearch from "@/components/molecules/search";

const emit = defineEmits<{
  (e: "onLogout"): void;
  (e: "onToggleSidebar"): void;
}>();

const toggleSidebar = () => emit("onToggleSidebar");
const logout = () => emit("onLogout");
</script>

<template>
  <header class="header">
    <!-- lado esquerdo -->
    <div class="left">
      <button class="menu" @click="toggleSidebar">
        <AtomsIcon name="menu" width="24" height="24" />
      </button>
      <span class="title">YPet</span>
    </div>

    <!-- lado direito -->
    <div class="right">
      <MoleculesSearch />
      <button class="logout" @click="logout">
        <AtomsIcon name="logout" width="20" height="20" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use "./styles.module.scss";
</style>
