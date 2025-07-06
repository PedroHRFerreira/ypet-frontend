<script lang="ts">
import { defineComponent} from "vue";

export default defineComponent({
  name: "OrganismsAuthLogin",
});
</script>

<template>
  <div class="wrapper-login">
    <div class="wrapper-login__header">
      <AtomsTypography
        type="title-h7"
        class="wrapper-login__title"
        text="Bem vindo de volta!"
        weight="medium"
        color="var(--brand-color-dark-blue-600)"
      />
    </div>
      <MoleculesInputCommon
        label="Endereço de e-mail"
      />
      <MoleculesInputPassword
        label="Senha"
        link-cta="Esqueceu a senha?"
        link-cta-label="Esqueceu a senha?"
      />
    <div class="wrapper-login__checkbox">
      <MoleculesInputCheckbox
        label="Me mantenha conectado"
      />
    </div>
    <MoleculesButtonsCommon text="Entrar" />
    <div class="wrapper-login__footer">
      <AtomsTypography
        type="text-p5"
        text="Não tem uma conta?"
        weight="medium"
        color="var(--brand-color-dark-blue-200)"
      />
      <AtomsLink text="Criar uma conta"  />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>