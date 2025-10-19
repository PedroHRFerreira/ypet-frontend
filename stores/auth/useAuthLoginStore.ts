import { useAuthToken } from "~/composables/useAuthToken";

export const useAuthLoginStore = defineStore("authLogin", {
	state: () => {
		const form = ref({
			login: {
				value: "",
				errorMessage: [] as string | string[],
			},
			password: {
				value: "",
				errorMessage: [] as string | string[],
			},
			rememberMe: {
				value: false,
				errorMessage: [] as string | string[],
			},
			token: {
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
	getters: {
		maskedLogin(): string {
			const login = this.form.login.value;
			const cleanLogin = login.replace(/\D/g, "");

			if (
				cleanLogin.length > 0 &&
				cleanLogin.length <= 11 &&
				!login.includes("@")
			) {
				return useMaskDocument(cleanLogin);
			}
			return login;
		},
	},
	actions: {
		async login(): Promise<boolean> {
			if (this.isLoading) {
				return false;
			}

			if (this.isLoggedIn()) {
				return true;
			}

			if (!this.validateForm()) {
				return false;
			}

			this.setIsLoading(true);
			const login = this.$state.form.login.value;
			const password = this.$state.form.password.value;
			const remember = this.$state.form.rememberMe.value;
			const { data } = await useFetch("/api/auth/login", {
				method: "POST",
				body: { login, password, remember },
			});

			const response: IResponse = data.value as IResponse;

			if (response.type === "success") {
				const token: IAccessToken = response.data as IAccessToken;
				useAuthToken().setTokenCookie(token);
				this.resetForm();
				this.setIsLoading(false);

				return true;
			}

			if (response.status === 422) {
				const errors = response?.errors || {};
				this.setErrorLogin(errors.login || ["Login inválido."]);
				this.setErrorPassword(errors.password || []);
				this.setIsLoading(false);

				return false;
			}

			if (response.status === 401) {
				this.setErrorLogin(["E-mail/CPF ou senha incorretos."]);
				this.setIsLoading(false);

				return false;
			}

			if (response.type === "error") {
				this.setErrorLogin([response.message || "Erro ao realizar login."]);
				this.setIsLoading(false);

				return false;
			}

			throw createError({
				statusCode: response.status,
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

			if (response.type === "error") {
				return false;
			}

			useAuthToken().removeTokenCookie();
			this.resetForm();
			this.setIsLoading(false);
			useRouter().go(0);

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

			if (response.type === "error") {
				return false;
			}

			useAuthToken().removeTokenCookie();
			this.resetForm();
			this.setIsLoading(false);
			useRouter().go(0);

			return true;
		},
		isLoggedIn() {
			const token = useAuthToken().getTokenCookie();

			return !!token;
		},
		setErrorLogin(message: string[]) {
			this.$state.form.login.errorMessage = message;
		},
		setErrorPassword(message: string[]) {
			this.$state.form.password.errorMessage = message;
		},
		setLogin(value: string) {
			const cleanValue = value.replace(/\D/g, "");
			if (
				cleanValue.length > 0 &&
				cleanValue.length <= 11 &&
				value === value.replace(/[a-zA-Z@]/g, "")
			) {
				this.$state.form.login.value = cleanValue;
			} else {
				this.$state.form.login.value = value;
			}
			this.setErrorLogin([]);
		},
		setPassword(value: string) {
			this.$state.form.password.value = value;
			this.setErrorPassword([]);
		},
		setErrorRememberMe(message: string[]) {
			this.$state.form.rememberMe.errorMessage = message;
		},
		setRememberMe(value: boolean) {
			this.$state.form.rememberMe.value = value;
			this.setErrorRememberMe([]);
		},
		setIsLoading(value: boolean) {
			this.$state.isLoading = value;
		},
		resetForm() {
			this.$state.form.login.value = "";
			this.setErrorLogin([]);
			this.setPassword("");
			this.setErrorPassword([]);
			this.setIsLoading(false);
			this.setRememberMe(false);
			this.setErrorRememberMe([]);
		},
		validateForm(): boolean {
			return this.checkLogin() && this.checkPassword();
		},
		checkLogin(): boolean {
			const login = this.$state.form.login.value || "";
			this.setErrorLogin([]);

			if (!login) {
				this.setErrorLogin(["E-mail ou CPF obrigatório"]);

				return false;
			}

			const cleanLogin = login.trim().replace(/\D/g, "");

			if (cleanLogin.length === 11 && !login.includes("@")) {
				if (!useValidateDocumentPF(cleanLogin)) {
					this.setErrorLogin(["CPF inválido"]);
					return false;
				}
				return true;
			}

			if (
				cleanLogin.length > 0 &&
				cleanLogin.length < 11 &&
				!login.includes("@")
			) {
				this.setErrorLogin(["CPF incompleto"]);
				return false;
			}

			if (
				!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(login.trim())
			) {
				this.setErrorLogin(["E-mail inválido"]);

				return false;
			}

			return true;
		},
		checkPassword(): boolean {
			const password = this.$state.form.password.value || "";
			this.setErrorPassword([]);

			if (!this.checkLogin()) {
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
	},
});
