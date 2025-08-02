export const useAuthForgotPasswordStore = defineStore("authForgotPassword", {
	state: () => {
		const form = ref({
			email: {
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
		async forgotPassword(): Promise<boolean> {
			if (this.isLoading) {
				return false;
			}

			if (!this.validateForm()) {
				return false;
			}

			this.setIsLoading(true);
			const email = this.$state.form.email.value;

			const { data } = await useFetch("/api/auth/forgot-password", {
				method: "POST",
				body: { email },
			});

			const response: IResponse = data.value as IResponse;

			if (response.type === "success") {
				this.setIsLoading(false);

				return true;
			}

			if (response.status === 422) {
				const errors = response.data.errors || {};
				this.setErrorEmail(errors.email || []);

				return false;
			}

			this.setIsLoading(false);
			return false;
		},

		validateForm(): boolean {
			return this.checkEmail();
		},

		setEmail(email: string): void {
			this.form.email.value = email;
			this.setErrorEmail([]);
		},

		setErrorEmail(errorMessage: string[]): void {
			this.form.email.errorMessage = errorMessage;
		},

		resetForm(): void {
			this.form.email.value = "";
			this.setErrorEmail([]);
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
				!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
			) {
				this.setErrorEmail(["Email inválido"]);

				return false;
			}

			this.setErrorEmail([]);

			return true;
		},
	},
});
