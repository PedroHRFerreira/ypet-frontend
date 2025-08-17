<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVeterinariansApi, type IVeterinario } from '~/composables/useVeterinariansApi'

const { list } = useVeterinariansApi()

const veterinarians = ref<IVeterinario[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    veterinarians.value = await list()
  } catch (err) {
    console.error('Erro ao carregar veterinários:', err)B
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Veterinários</h1>

    <div v-if="isLoading">Carregando...</div>

    <table v-else class="min-w-full border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">Nome</th>
          <th class="px-4 py-2 border">CRMV</th>
          <th class="px-4 py-2 border">UF</th>
          <th class="px-4 py-2 border">E-mail</th>
          <th class="px-4 py-2 border">Telefone</th>
          <th class="px-4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vet in veterinarians" :key="vet.id">
          <td class="px-4 py-2 border">{{ vet.nome }}</td>
          <td class="px-4 py-2 border">{{ vet.crmv }}</td>
          <td class="px-4 py-2 border">{{ vet.uf }}</td>
          <td class="px-4 py-2 border">{{ vet.email }}</td>
          <td class="px-4 py-2 border">{{ vet.telefone }}</td>
          <td class="px-4 py-2 border">{{ vet.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
