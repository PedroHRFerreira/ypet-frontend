import { useAuthToken } from "~/composables/useAuthToken";
import type { Ref } from "vue";

export const useAuthLoginStore = defineStore("authLogin", {
  state: () => {
    const form = ref({
      email: {
        value: "marcus@ypet.com23",
        errorMessage: [] as string | string[],
      },
      password: {
        value: "password",
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
    async login(): Promise<boolean> {
      if (this.isLoggedIn()) {
        return true;
      }

      if (!this.validateForm()) {
        console.log("Form validation failed.");
        return false;
      }

      this.setIsLoading(true);
      const email = this.$state.form.email.value;
      const password =  this.$state.form.password.value;
      const {data} = await useFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      const response: IResponse = data.value as IResponse;

      if (response.status === "success") {
        const token: IAccessToken = response.data as IAccessToken;
        useAuthToken().setTokenCookie(token);
        this.resetForm();
        this.setIsLoading(false);

        return true;
      }

      if (response.statusCode === 422) {
        this.setErrorEmail(
          response.data.errors.email ||
          ["Invalid email address."]
        );
        this.setErrorPassword(response.data.errors.password || []);
        this.setIsLoading(false);

        return false;
      }

      throw createError({
        statusCode: response.statusCode,
        statusMessage: response.message,
        data: response.data,
      });
    },
    async logout(): Promise<boolean> {
      if (!this.isLoggedIn()) {
        return false;
      }

      this.setIsLoading(true);
      const { data } = await useFetch("/api/auth/logout", {
        method: "POST",
      });

      const response: IResponse = data.value as IResponse;

      if (response.status === "error") {
        return false;
      }

      useAuthToken().removeTokenCookie();
      this.resetForm();
      this.setIsLoading(false);

      return true;
    },
    async logoutAll(): Promise<boolean> {
      if (!this.isLoggedIn()) {
        return false;
      }

      this.setIsLoading(true);
      const { data } = await useFetch("/api/auth/logoutAll", {
        method: "POST",
      });

      const response: IResponse = data.value as IResponse;

      if (response.status === "error") {
        return false;
      }

      useAuthToken().removeTokenCookie();
      this.resetForm();
      this.setIsLoading(false);

      return true;
    },
    isLoggedIn() {
      const token = useAuthToken().getTokenCookie();

      return !!token;
    },
    setErrorEmail(message: string[]) {
      this.$state.form.email.errorMessage = message;
    },
    setErrorPassword(message: string[]) {
      this.$state.form.password.errorMessage = message;
    },
    setEmail(value: string) {
      this.$state.form.email.value = value;
      this.setErrorEmail([]);
    },
    setPassword(value: string) {
      this.$state.form.password.value = value;
      this.setErrorPassword([]);
    },
    setIsLoading(value: boolean) {
      this.$state.isLoading = value;
    },
    resetForm() {
      this.setErrorEmail([]);
      this.setPassword("");
      this.setErrorPassword([]);
      this.setIsLoading(false);
    },
    validateForm(): boolean {
      return this.checkEmail() && this.checkPassword();
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

      return true;
    },
  }
});
