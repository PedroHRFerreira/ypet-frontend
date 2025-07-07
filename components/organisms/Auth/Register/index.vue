<script lang="ts">
import { defineComponent} from "vue";
import { useAuthRegisterStore } from "~/stores/auth/useAuthRegisterStore";

export default defineComponent({
  name: "OrganismsAuthRegister",
  setup() {
    const useAuthRegister = useAuthRegisterStore();

    return {
      useAuthRegister
    }
  },
  methods: {
    handleRegister(): void {
      this.useAuthRegister.register().then(((res: boolean) => {
        if (res) {
          useRouter().push({
            name: "home",
          });
        }
      }))
    },
    goToLogin(): void {
      useRouter().push({
        name: "login",
      });
    }
  }
});
</script>

<template>
<div class="wrapper-register">
  <div class="wrapper-register__header">
    <AtomsTypography
      type="title-h7"
      class="wrapper-login__title"
      text="Criar sua conta"
      weight="medium"
      color="var(--brand-color-dark-blue-600)"
    />
  </div>
  <div class="wrapper-register__main">
    <MoleculesInputCommon
      label="Nome"
      :value="useAuthRegister.form.name.value"
      @on-input="useAuthRegister.setName"
      :message-error="useAuthRegister.form.name.errorMessage.toString()"
    />
    <MoleculesInputCommon
      label="Endereço de e-mail"
      :value="useAuthRegister.form.email.value"
      @on-input="useAuthRegister.setEmail"
      :message-error="useAuthRegister.form.email.errorMessage.toString()"
    />
    <MoleculesInputPassword
      label="Senha"
      :value="useAuthRegister.form.password.value"
      @oninput="useAuthRegister.setPassword"
      @onkeyupEnter="useAuthRegister.setPassword"
      :message-error="useAuthRegister.form.password.errorMessage.toString()"
    />
    <MoleculesInputPassword
      label="Confirmar Senha"
      :value="useAuthRegister.form.password_confirmation.value"
      @oninput="useAuthRegister.setPasswordConfirmation"
      @onkeyupEnter="useAuthRegister.setPasswordConfirmation"
      :message-error="useAuthRegister.form.password_confirmation.errorMessage.toString()"
    />
  </div>
  <div class="wrapper-register__footer">
    <MoleculesButtonsCommon text="Criar conta" @onclick="handleRegister()" />
    <MoleculesButtonsCommon type="secondary" text="Voltar" @onclick="goToLogin()" />
  </div>
</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>