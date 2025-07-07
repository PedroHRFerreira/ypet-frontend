<script lang="ts">
import { defineComponent} from "vue";
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineComponent({
  name: "OrganismsAuthLogin",
  setup() {
    const useAuthLogin = useAuthLoginStore();

    return {
      useAuthLogin,
    };
  },
  computed: {
    linkCtaForgotPassword() {
      return {
        text: "Esqueceu a senha?",
        to: {
          name: "forgot-password",
        },
    };
    },
  },
  methods: {
    handleLogin() {
      this.useAuthLogin.login().then(((res: boolean) => {
        if (res) {
          useRouter().push({
            name: "home",
          });
        }
      }));
    }
  }
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
        :value="useAuthLogin.form.email.value"
        @on-input="useAuthLogin.setEmail"
        :message-error="useAuthLogin.form.email.errorMessage.toString()"
      />
      <MoleculesInputPassword
        label="Senha"
        :link-cta="linkCtaForgotPassword.to.name"
        :link-cta-label="linkCtaForgotPassword.text"
        :value="useAuthLogin.form.password.value"
        @oninput="useAuthLogin.setPassword"
        @onkeyupEnter="useAuthLogin.setPassword"
        :message-error="useAuthLogin.form.password.errorMessage.toString()"
      />
    <div class="wrapper-login__checkbox">
      <MoleculesInputCheckbox
        label="Me mantenha conectado"
        :model-value="useAuthLogin.form.rememberMe.value"
        @update:modelValue="useAuthLogin.setRememberMe"
      />
    </div>
    <MoleculesButtonsCommon text="Entrar" @onclick="handleLogin()" />
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