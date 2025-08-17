<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchVeterinarians } from "@/services/veterinarians.service";

export default defineComponent({
  name: "OrganismsVeterinarianList",
  setup() {
    const router = useRouter();
    const veterinarians = ref<any[]>([]);
    const loading = ref(true);

    const loadData = async () => {
      loading.value = true;
      try {
        veterinarians.value = await fetchVeterinarians();
      } finally {
        loading.value = false;
      }
    };

    const goToCreate = () => {
      router.push({ path: "/veterinarians/create" });
    };

    const goToDetails = (id: number) => {
      router.push({ path: `/veterinarians/${id}` });
    };

    onMounted(loadData);

    return {
      veterinarians,
      loading,
      goToCreate,
      goToDetails,
    };
  },
});
</script>

<template>
  <div class="vet-list">
    <div class="vet-list__header">
      <h2>Veterinários</h2>
      <AtomsButton @click="goToCreate">Novo Veterinário</AtomsButton>
    </div>

    <div v-if="loading" class="vet-list__loading">
      <span>Carregando...</span>
    </div>

    <div v-else class="vet-list__table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CRMV</th>
            <th>Especialidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vet in veterinarians" :key="vet.id">
            <td>{{ vet.name }}</td>
            <td>{{ vet.crmv }}</td>
            <td>{{ vet.specialty }}</td>
            <td>
              <AtomsButton size="sm" variant="secondary" @click="goToDetails(vet.id)">Detalhes</AtomsButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
