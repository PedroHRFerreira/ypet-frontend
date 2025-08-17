<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VeterinarianDetails",
  props: {
    veterinarian: {
      type: Object,
      required: true,
    },
  },
});
</script>

<template>
  <div class="veterinarian-details">
    <h2 class="veterinarian-details__title">Detalhes do Veterinário</h2>
    <div class="veterinarian-details__info">
      <p><strong>Nome:</strong> {{ veterinarian.name }}</p>
      <p><strong>CRMV:</strong> {{ veterinarian.crmv }}</p>
      <p><strong>Email:</strong> {{ veterinarian.email }}</p>
      <p><strong>Telefone:</strong> {{ veterinarian.phone }}</p>
      <p><strong>Especialidade:</strong> {{ veterinarian.specialty }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
