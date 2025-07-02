import { useAuthToken } from "~/composables/useAuthToken";
import type { Ref } from "vue";

export const useAuthLoginStore = defineStore("authRegister", {
  state: () => {
    const form = ref({
      name: {
        value: "",
        errorMessage: [] as string | string[],
      },
      email: {
        value: "",
        errorMessage: [] as string | string[],
      },
      password: {
        value: "",
        errorMessage: [] as string | string[],
      },
      password_confirmation: {
        value: "",
        errorMessage: [] as string | string[],
      }
    });

    const isLoading = ref(false);

    return {
      isLoading,
      form,
    };
  },
  actions: {
    setErrorName(message: string[]) {
      this.$state.form.name.errorMessage = message;
    },
    setName(value: string) {
      this.$state.form.name.value = value;
      this.setErrorName([]);
    },
    setErrorEmail(message: string[]) {
      this.$state.form.email.errorMessage = message;
    },
    setEmail(value: string) {
      this.$state.form.email.value = value;
      this.setErrorEmail([]);
    },
    setErrorPassword(message: string[]) {
      this.$state.form.password.errorMessage = message;
    },
    setPassword(value: string) {
      this.$state.form.password.value = value;
      this.setErrorPassword([]);
    },
    setPasswordConfirmation(value: string) {
      this.$state.form.password_confirmation.value = value;
    },
    setIsLoading(value: boolean) {
      this.$state.isLoading = value;
    },
    resetForm() {
      this.setName("");
      this.setErrorName([]);
      this.setEmail("");
      this.setErrorEmail([]);
      this.setPassword("");
      this.setPasswordConfirmation("");
      this.setErrorPassword([]);
      this.setIsLoading(false);
    },
    validateForm(): boolean {
      return this.checkEmail() && this.checkPassword() && this.checkName();
    },
    checkName(): boolean {
      const name = this.$state.form.name.value || "";
      this.setErrorName([]);

      if (!name.trim()) {
        this.setErrorName(["Nome obrigatório"]);

        return false;
      }

      if (name.trim().length < 3) {
        this.setErrorName(["O nome deve conter pelo menos 3 caracteres"]);

        return false;
      }

      return true;
    },
    checkEmail(): boolean {
      const email = this.$state.form.email.value || "";
      this.setErrorEmail([]);

      if (!email) {
        this.setErrorEmail(["Email obrigatório"]);

        return false;
      }

      if (
        !/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(
          email.trim(),
        )
      ) {
        this.setErrorEmail(["Email inválido"]);

        return false;
      }

      return true;
    },
    checkPassword(): boolean {
      const password = this.$state.form.password.value || "";
      const passwordConfirmation = this.$state.form.password_confirmation.value || "";

      this.setErrorPassword([]);

      if (!this.checkEmail()) {
        return false;
      }

      if (!password.trim()) {
        this.setErrorPassword(["Senha obrigatório"]);

        return false;
      }

      if (password.trim().length < 8) {
        this.setErrorPassword(["A senha deve conter pelo menos 8 caracteres"]);

        return false;
      }

      if (password.trim() !== passwordConfirmation.trim()) {
        this.setErrorPassword(["As senhas não conferem"]);

        return false;
      }

      return true;
    },
  }
});
