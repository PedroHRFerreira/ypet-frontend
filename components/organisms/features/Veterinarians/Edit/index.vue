<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "VeterinarianEdit",
  props: {
    veterinarian: {
      type: Object,
      required: true,
    },
  },
  emits: ["onSave"],
  setup(props, { emit }) {
    const form = reactive({ ...props.veterinarian });

    const save = () => {
      emit("onSave", form);
    };

    return { form, save };
  },
});
</script>

<template>
  <div class="veterinarian-edit">
    <h2 class="veterinarian-edit__title">Editar Veterinário</h2>
    <form class="veterinarian-edit__form" @submit.prevent="save">
      <label>
        Nome
        <input v-model="form.name" type="text" />
      </label>
      <label>
        CRMV
        <input v-model="form.crmv" type="text" />
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Telefone
        <input v-model="form.phone" type="text" />
      </label>
      <label>
        Especialidade
        <input v-model="form.specialty" type="text" />
      </label>
      <button type="submit" class="veterinarian-edit__save">Salvar</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
