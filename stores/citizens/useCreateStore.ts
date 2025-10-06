import { useForm } from "~/composables/useForm";

export const useCreateStore = defineStore("citizens-create", {
	state: () => {
		const citizens = ref({} as ICitizens);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		const form = useForm([
			"name",
			"document",
			"password",
			"password_confirmation",
			"email",
			"gender",
			"birth_date",
			"telephone",
			"street",
			"number",
			"zip_code",
			"district",
			"complement",
			"state",
			"status",
			"can_report_abuse",
			"can_mobile_castration",
		]);

		return {
			citizens,
			isLoading,
			errorMessage,
			successMessage,
			form,
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
			const formData = new FormData();

			const addressFields = [
				"zip_code",
				"street",
				"number",
				"complement",
				"district",
				"city",
				"state",
			];

			for (const key in this.form) {
				if (!Object.prototype.hasOwnProperty.call(this.form, key)) continue;

				const value = this.form[key].value as string | IOption;

				if (value === null || value === undefined) continue;

				let finalValue: string;

				if (typeof value === "object" && value !== null && "id" in value) {
					finalValue = String(value.id);
				} else {
					finalValue = String(value);
				}

				if (addressFields.includes(key)) {
					formData.append(`address[0][${key}]`, finalValue);
				} else {
					formData.append(key, finalValue);
				}
			}

			formData.append("special_permissions", "0");

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
		async create(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch("/api/citizens/store", {
				method: "POST",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data || ({} as IResponse);

					if (responseData.type === "error") {
						return this.handleResponseError(responseData);
					}

					this.successMessage = responseData.message || "Criado com sucesso!";
					this.citizens = responseData.data || ({} as ICitizens);
					this.isLoading = false;

					const router = useRouter();
					router.push({ name: "citizens-list" });
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
			this.errorMessage = "";
			this.successMessage = "";
			this.citizens = {} as ICitizens;
		},
	},
});
