import { useForm } from "~/composables/useForm";

export const useCreateStore = defineStore("create", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"cnpj",
			"work_started_at",
			"work_ended_at",
			"observations",
			"user_role",
			"user_email",
			"user_name",
			"user_status",
			"cpf_cnpj",
			"account_type",
			"pix_key",
			"bank_account_type",
			"bank",
			"agency",
			"account_number",
			"account_holder",
		]);
		const pathUrl = "/api/collaborators/store";

		return {
			isLoading,
			errorMessage,
			successMessage,
			form,
			pathUrl,
		};
	},
	actions: {
		setFormField(field: string, value: any): void {
			this.form[field].value = value;
			this.setFormError(field, []);
		},
		setFormError(field: string, errorMessages: string[]): void {
			this.form[field].errorMessages = errorMessages;
		},
		getFormData(): FormData {
			const formData: FormData = new FormData();
			for (const key in this.form) {
				if (Object.prototype.hasOwnProperty.call(this.form, key)) {
					const value = this.form[key].value as string | IOption;

					if (value === null || value === undefined) {
						continue;
					}

					if (typeof value === "object") {
						if (Object.prototype.hasOwnProperty.call(value, "id")) {
							formData.set(key, String(value.id));

							continue;
						}
					}

					formData.set(key, String(value));
				}
			}

			return formData;
		},
		handleResponseError(response: IResponse): void {
			if (response.type !== "error") {
				return;
			}

			this.errorMessage =
				response.message || "Erro ao processar a solicitação.";

			if (response.status === 401) {
				this.errorMessage =
					response.message ||
					"Não autorizado. Por favor, faça login novamente.";
			}

			if (response.status === 422) {
				for (const field in response.errors) {
					if (Object.prototype.hasOwnProperty.call(response.errors, field)) {
						this.setFormError(field, response.errors[field]);
					}
				}
			}

			this.isLoading = false;
		},
		async store(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch(this.pathUrl, {
				method: "POST",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data || ({} as IResponse);

					if (responseData.type === "error") {
						return this.handleResponseError(responseData);
					}

					this.successMessage = responseData.message || "Criado com sucesso!";
					this.isLoading = false;
				},
			});
		},
		resetForm() {
			for (const key in this.form) {
				if (Object.prototype.hasOwnProperty.call(this.form, key)) {
					this.form[key].value = null;
					this.form[key].errorMessages = [];
				}
			}
			this.isLoading = false;
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
