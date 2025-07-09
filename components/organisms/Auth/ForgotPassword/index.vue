<script lang="ts">
import { defineComponent } from "vue";
import { useAuthForgotPasswordStore } from "~/stores/auth/useAuthForgotPasswordStore";

export default defineComponent({
  name: "OrganismsAuthForgotPassword",
  setup() {
    const useAuthForgotPassword = useAuthForgotPasswordStore();

    return {
      useAuthForgotPassword
    }
  },
  methods: {
    handleForgotPassword() {
      this.useAuthForgotPassword.forgotPassword()
        .then(((res: boolean) => {
          if (res) {
            const email = this.useAuthForgotPassword.form.email.value;
            this.useAuthForgotPassword.resetForm();

            useRouter().push({
              name: "login",
              query: {
                email,
              },
            });
          }
        }));
    },
    goToLogin() {
      useRouter().push({
        name: "login",
      });
    }
  }
});
</script>

<template>
<div class="wrapper-forgot-password">
  <div class="wrapper-forgot-password__header">
    <AtomsTypography
      type="title-h7"
      class="wrapper-login__title"
      text="Esqueci minha senha"
      weight="medium"
      color="var(--brand-color-dark-blue-600)"
    />
  </div>
  <div class="wrapper-forgot-password__main">
    <MoleculesInputCommon
      label="Endereço de e-mail"
      :value="useAuthForgotPassword.form.email.value"
      @on-input="useAuthForgotPassword.setEmail"
      :message-error="useAuthForgotPassword.form.email.errorMessage.toString()"
    />
  </div>
  <div class="wrapper-forgot-password__footer">
    <MoleculesButtonsCommon text="Enviar" @onclick="handleForgotPassword()" />
    <MoleculesButtonsCommon type="secondary" text="Voltar" @onclick="goToLogin()" />
  </div>
</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>