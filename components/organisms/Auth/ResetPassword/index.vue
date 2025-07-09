<script lang="ts">
import { defineComponent } from "vue";
import { useAuthResetPasswordStore } from "~/stores/auth/useAuthResetPasswordStore";

export default defineComponent({
  name: "OrganismsAuthResetPassword",
  setup() {
    const useAuthResetPassword = useAuthResetPasswordStore();
    const useAuthLogin = useAuthResetPasswordStore();

    return {
      useAuthResetPassword,
      useAuthLogin
    }
  },
  methods: {
    handleResetPassword() {
      this.useAuthResetPassword.resetPassword()
        .then(((res: boolean) => {
        if (res) {
          const email = this.useAuthResetPassword.form.email.value;
          this.useAuthResetPassword.resetForm();

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
  <div class="wrapper-reset-password">
    <div class="wrapper-reset-password__header">
      <AtomsTypography
        type="title-h7"
        class="wrapper-login__title"
        text="Redefinir senha"
        weight="medium"
        color="var(--brand-color-dark-blue-600)"
      />
    </div>
    <div class="wrapper-reset-password__main">
      <MoleculesInputCommon
        label="Endereço de e-mail"
        :value="useAuthResetPassword.form.email.value"
        @on-input="useAuthResetPassword.setEmail"
        :message-error="useAuthResetPassword.form.email.errorMessage.toString()"
      />
      <MoleculesInputPassword
        label="Nova Senha"
        :value="useAuthResetPassword.form.password.value"
        @oninput="useAuthResetPassword.setPassword"
        @onkeyupEnter="useAuthResetPassword.setPassword"
        :message-error="useAuthResetPassword.form.password.errorMessage.toString()"
      />
      <MoleculesInputPassword
        label="Confirmar Senha"
        :value="useAuthResetPassword.form.password_confirmation.value"
        @oninput="useAuthResetPassword.setPasswordConfirmation"
        @onkeyupEnter="useAuthResetPassword.setPasswordConfirmation"
        :message-error="useAuthResetPassword.form.password_confirmation.errorMessage.toString()"
      />
    </div>
    <div class="wrapper-reset-password__footer">
      <MoleculesButtonsCommon
        text="Redefinir Senha"
        @onclick="handleResetPassword()"
      />
      <MoleculesButtonsCommon
        type="secondary"
        text="Voltar"
        @onclick="goToLogin()"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>