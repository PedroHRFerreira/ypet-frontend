<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AtomsIcon from "@/components/atoms/icon";
import MoleculesSidebarIten from "@/components/molecules/sidebarIten";

const emit = defineEmits<{
  (e: "onclick", text: string): void;
}>();

const router = useRouter();
const activeItem = ref(false);

const menuItems = [
  { text: "Home", icon: "home", active: "index", route: "" },
  { text: "Cadastro de animais", icon: "paste", active: "animals", route: "animals" },
  { text: "Castramóvel", icon: "truck", active: "castramobile", route: "castramobile" },
  { text: "Ocorrências", icon: "urgent", active: "occurrences", route: "occurrences" },
  { text: "Samupet", icon: "health", active: "samupet", route: "samupet" },
  { text: "Vacina e vermifugação", icon: "vaccine", active: "vaccine", route: "vaccine" },
  { text: "Funcionários", icon: "user-plus", active: "employees", route: "employees" },
  { text: "Cidadãos", icon: "smile", active: "citizens", route: "citizens" },
  { text: "Cuidadores", icon: "heart", active: "caretakers", route: "caretakers" },
  { text: "Produtos e insumos", icon: "box", active: "products", route: "products" },
  { text: "Locais", icon: "location", active: "locations", route: "locations" },
  { text: "Fornecedores", icon: "user-check", active: "suppliers", route: "suppliers" },
  { text: "Veterinários", icon: "calendar", active: "veterinarians", route: "veterinarians" },
  { text: "Configurações", icon: "settings", active: "settings", route: "settings" },
];

const routerPage = (route: string, text: string) => {
  activeItem.value = !activeItem.value;
  router.push({ path: `/${route}` });
  emit("onclick", text);
};

const verifyActive = (active: string) => {
  return active === router.currentRoute.value.name;
};
</script>

<template>
  <aside class="sidebar">
    <div class="logo">
      <AtomsIcon name="logo-blue" width="89px" height="40px" />
    </div>

    <nav class="options">
      <MoleculesSidebarIten
        v-for="(item, index) in menuItems.slice(0, -1)"
        :key="index"
        :icon="item.icon"
        :text="item.text"
        :active="verifyActive(item.active)"
        @onclick="routerPage(item.route, item.text)"
      />
    </nav>

    <div class="config">
      <MoleculesSidebarIten
        :icon="menuItems[menuItems.length - 1].icon"
        :text="menuItems[menuItems.length - 1].text"
        :active="verifyActive(menuItems[menuItems.length - 1].active)"
        @onclick="routerPage(menuItems[menuItems.length - 1].route, menuItems[menuItems.length - 1].text)"
      />
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use "./styles.module.scss";
</style>
