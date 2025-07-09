export const useAuthResetPasswordStore = defineStore("authResetPassword", {
  state: () => {
    const form = ref({
      token: {
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
      },
    });

    const isLoading = ref(false);

    return {
      isLoading,
      form,
    };
  },
  actions: {
    async resetPassword(): Promise<boolean> {
      if (this.isLoading) {
        return false;
      }

      if (!this.validateForm()) {
        return false;
      }

      this.setIsLoading(true);
      const email = this.$state.form.email.value;
      const token = this.$state.form.token.value;
      const password = this.$state.form.password.value;
      const password_confirmation = this.$state.form.password_confirmation.value;

      const { data } = await useFetch("/api/auth/reset-password", {
        method: "POST",
        body: {
          token,
          email,
          password,
          password_confirmation,
        },
      });

      const response: IResponse = data.value as IResponse;

      if (response.status === "success") {
        this.setIsLoading(false);

        return true;
      }

      if (response.statusCode === 422) {
        const errors = response.data.errors || {};
        this.setErrorEmail(errors.email || []);

        return false;
      }

      this.setIsLoading(false);
      return false;
    },

    validateForm(): boolean {
      return this.checkEmail() && this.checkPassword();
    },

    setToken(token: string): void {
      this.$state.form.token.value = token;
      this.setErrorToken([]);
    },

    setErrorToken(errorMessage: string[]): void {
      this.$state.form.token.errorMessage = errorMessage;
    },

    setEmail(email: string): void {
      this.form.email.value = email;
      this.setErrorEmail([]);
    },

    setErrorEmail(errorMessage: string[]): void {
      this.form.email.errorMessage = errorMessage;
    },

    setPassword(value: string) {
      this.$state.form.password.value = value;
      this.setErrorPassword([]);
    },

    setErrorPassword(message: string[]) {
      this.$state.form.password.errorMessage = message;
    },

    setErrorPasswordConfirmation(message: string[]) {
      this.$state.form.password_confirmation.errorMessage = message;
    },

    setPasswordConfirmation(value: string) {
      this.$state.form.password_confirmation.value = value;
      this.setErrorPasswordConfirmation([]);
    },

    resetForm(): void {
      this.setToken("");
      this.setErrorToken([]);
      this.setEmail("");
      this.setErrorEmail([]);
      this.setPassword("");
      this.setErrorPassword([]);
      this.setPasswordConfirmation("");
      this.setErrorPasswordConfirmation([]);
      this.setIsLoading(false);
    },

    setIsLoading(loading: boolean): void {
      this.isLoading = loading;
    },

    checkEmail(): boolean {
      const email = this.form.email.value;
      if (!email) {
        this.setErrorEmail(["Email é obrigatório"]);

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

      this.setErrorEmail([]);

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
        this.setErrorPasswordConfirmation(["As senhas não conferem"]);

        return false;
      }

      return true;
    },
  }
});