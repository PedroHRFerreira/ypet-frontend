<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalsCreate } from "~/stores/animals/useAnimalsCreate";

export default defineComponent({
  name: "OrganismsAnimalsCreate",
  setup() {
    const useAnimalsCreateStore = useAnimalsCreate();
    const { form } = useAnimalsCreateStore;
    const optionsType: IOption[] = [
      { id: "dog", text: "Cachorro" },
      { id: "cat", text: "Gato" },
      { id: "bird", text: "Pássaro" },
      { id: "fish", text: "Peixe" },
    ];

    const optionsSex: IOption[] = [
      { id: 'female', text: 'Fêmea' },
      { id: 'male', text: 'Macho' },
      { id: 'unknown', text: 'Desconhecido' },
    ];

    const optionsBoolean: IOption[] = [
      { id: 1, text: 'Sim' },
      { id: 0, text: 'Não' },
    ];

    const birthDate = {
      day: '',
      month: '',
      year: '',
    };

    return {
      optionsSex,
      optionsType,
      optionsBoolean,
      birthDate,
      form,
      useAnimalsCreateStore,
    };
  },
});
</script>

<template>
  <div class="animal">
    <section class="animal__about-pet">
      <div class="animal__about-pet__header">
        <AtomsTypography
          type="text-p2"
          text="Sobre o pet"
          weight="medium"
          color="var(--brand-color-dark-blue-900)"
        />
      </div>
      <div class="animal__about-pet__content">
        <MoleculesInputCommon
          label="Nome do animal"
          max-width="482px"
          :value="form.name.value as string"
          :message-error="form.name.errorMessages.join(', ')"
          @on-input=""
        />
        <MoleculesSelectsSimple max-width="215px" label="Tipo de Pet" :options="optionsType" />
        <MoleculesSelectsSimple max-width="243px" label="Sexo" :options="optionsSex" />
        <MoleculesInputCommon
          label="Peso"
          type-input="number"
          max-width="216px"
          :maxlength="2"
          :value="form.weight.value as string"
          :message-error="form.weight.errorMessages.join(', ')"
          @on-input=""
        />
        <MoleculesInputOptionGroup modelValue="1" name="Castrado" label="Castrado" :options="optionsBoolean" />
        <MoleculesDateInputGroup
          label="Data de nascimento"
          v-model="birthDate"
          :message-error="form.birthDate.errorMessages.join(', ')"
        />
      </div>
    </section>
    <section class="animal__input-data">
      <div class="animal__input-data-header">
        <AtomsTypography
          type="text-p2"
          text="Dados de entrada"
          weight="medium"
          color="var(--brand-color-dark-blue-900)"
        />
      </div>
      <div class="animal__input-data__content">
        <div class="animal__input-data__content--group">
          <MoleculesDateInputGroup
            label="Data de nascimento"
            v-model="birthDate"
            :message-error="form.birthDate.errorMessages.join(', ')"
          />
          <MoleculesSelectsSimple
            max-width="215px"
            label="Status"
            :options="optionsSex"
          />
          <MoleculesInputCommon
            label="Local da castração"
            type-input="number"
            :maxlength="2"
            :value="form.weight.value as string"
            :message-error="form.weight.errorMessages.join(', ')"
            @on-input=""
          />
        </div>

        <div class="animal__input-data__content--group">
          <MoleculesSelectsSimple
            max-width="450px"
            label="Motivo"
            :options="optionsSex"
          />
          <MoleculesInputCommon
            label="Local do recolhimento"
            type-input="number"
            :maxlength="2"
            :value="form.weight.value as string"
            :message-error="form.weight.errorMessages.join(', ')"
            @on-input=""
          />
        </div>
        <div class="animal__input-data__content--group">
          <MoleculesInputCommon
            label="Número da inscrição"
            type-input="number"
            max-width="216px"
            :maxlength="2"
            :value="form.weight.value as string"
            :message-error="form.weight.errorMessages.join(', ')"
            @on-input=""
          />
          <MoleculesInputCommon
            label="Número do microchip"
            type-input="number"
            max-width="216px"
            :maxlength="2"
            :value="form.weight.value as string"
            :message-error="form.weight.errorMessages.join(', ')"
            @on-input=""
          />
        </div>
      </div>
      <div class="animal__input-data__footer">
        <MoleculesButtonsCommon
          type="primary"
          text="Cadastrar"
          width="128px"
          @onclick="useAnimalsCreateStore.createAnimal()"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>