<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { createVeterinarian } from "@/services/veterinarians.service";

export default defineComponent({
  name: "OrganismsVeterinarianCreate",
  setup() {
    const router = useRouter();
    const form = ref({
      name: "",
      crmv: "",
      specialty: "",
    });

    const save = async () => {
      await createVeterinarian(form.value);
      router.push("/veterinarians");
    };

    return {
      form,
      save,
    };
  },
});
</script>

<template>
  <div class="vet-create">
    <h2>Cadastrar Veterinário</h2>
    <MoleculesForm @submit.prevent="save">
      <MoleculesFormField label="Nome">
        <AtomsInput v-model="form.name" placeholder="Nome completo" />
      </MoleculesFormField>
      <MoleculesFormField label="CRMV">
        <AtomsInput v-model="form.crmv" placeholder="CRMV" />
      </MoleculesFormField>
      <MoleculesFormField label="Especialidade">
        <AtomsInput v-model="form.specialty" placeholder="Ex: Cirurgia" />
      </MoleculesFormField>

      <AtomsButton type="submit">Salvar</AtomsButton>
    </MoleculesForm>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
