<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganismsHomeDashboards",
  setup() {
    const dashboards: DashboardType[] = [
      {
        id: 1,
        title: "Cadastros de animais",
        value: 0,
        difference: "+8.700",
        subtitle: "Desde a semana passada"
      },
      {
        id: 2,
        title: "Ocorrências",
        value: 0,
        difference: "+8.700",
        subtitle: "Desde a semana passada"
      },
      {
        id: 3,
        title: "Adoções",
        value: 0,
        difference: "+8.700",
        subtitle: "Desde a semana passada"
      },
      {
        id: 4,
        title: "Tarefas pendentes",
        value: 0,
        difference: "+8.700",
        subtitle: "Desde a semana passada"
      }
    ];


    return {
      dashboards
    };
  }
});
</script>

<template>
  <div class="dashboard-container">
    <MoleculesDashboardCard
      v-for="dashboard in dashboards"
      :key="dashboard.id"
      :title="dashboard.title"
      :value="dashboard.value"
      :difference="dashboard.difference"
      :subtitle="dashboard.subtitle"
    />
  </div>

</template>

<style scoped lang="scss">
.dashboard-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px;
}
</style>