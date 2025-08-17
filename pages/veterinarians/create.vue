<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVeterinariansApi, type IVeterinario } from '~/composables/useVeterinariansApi'

const router = useRouter()
const { create } = useVeterinariansApi()

// Formulário inicial
const form = ref<IVeterinario>({
  nome: '',
  cpf: '',
  crmv: '',
  uf: '',
  email: '',
  telefone: '',
  instituicao_vinculada: '',
  tipo_vinculo: 'Efetivo',
  pode_acessar_castramovel: false,
  pode_aplicar_vacinas: false,
  status: 'Ativo',
  observacoes: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

async function submitForm() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await create(form.value)
    router.push('/veterinarians') // volta pra listagem
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Erro ao salvar veterinário.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Novo Veterinário</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block mb-1">Nome</label>
        <input v-model="form.nome" type="text" class="border p-2 w-full" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">CPF</label>
          <input v-model="form.cpf" type="text" class="border p-2 w-full" required />
        </div>
        <div>
          <label class="block mb-1">CRMV</label>
          <input v-model="form.crmv" type="text" class="border p-2 w-full" required />
        </div>
      </div>

      <div>
        <label class="block mb-1">UF</label>
        <input v-model="form.uf" type="text" class="border p-2 w-full" maxlength="2" required />
      </div>

      <div>
        <label class="block mb-1">E-mail</label>
        <input v-model="form.email" type="email" class="border p-2 w-full" required />
      </div>

      <div>
        <label class="block mb-1">Telefone</label>
        <input v-model="form.telefone" type="text" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block mb-1">Instituição vinculada</label>
        <input v-model="form.instituicao_vinculada" type="text" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block mb-1">Tipo de vínculo</label>
        <select v-model="form.tipo_vinculo" class="border p-2 w-full">
          <option value="Efetivo">Efetivo</option>
          <option value="Voluntário">Voluntário</option>
          <option value="Conveniado">Conveniado</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2">
          <input v-model="form.pode_acessar_castramovel" type="checkbox" />
          Pode acessar Castramóvel
        </label>
        <label class="flex items-center gap-2">
          <input v-model="form.pode_aplicar_vacinas" type="checkbox" />
          Pode aplicar vacinas
        </label>
      </div>

      <div>
        <label class="block mb-1">Status</label>
        <select v-model="form.status" class="border p-2 w-full">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <div>
        <label class="block mb-1">Observações</label>
        <textarea v-model="form.observacoes" class="border p-2 w-full"></textarea>
      </div>

      <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Salvando...' : 'Salvar' }}
      </button>
    </form>
  </div>
</template>
