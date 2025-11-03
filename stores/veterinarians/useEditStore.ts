import { useForm } from "~/composables/useForm";
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export const useEditStore = defineStore("veterinarians-edit", {
	state: () => {
		const veterinarian = ref({} as IVeterinarian);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		const form = useForm([
			"name",
			"document",
			"crmv",
			"uf",
			"email",
			"phone",
			"linked_institution",
			"linked_type",
			"observations",
			"status",
			"permissions_can_access_castromovel",
			"permissions_can_apply_vaccine",
		]);

		return {
			veterinarian,
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

				const authStore = useAuthLoginStore();
				authStore.logout();
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
		async update(id: number | string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch(`/api/veterinarians/${id}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data || ({} as IResponse);

					if (responseData.type === "error") {
						return this.handleResponseError(responseData);
					}

					this.successMessage =
						responseData.message || "Atualizado com sucesso!";
					this.veterinarian = responseData.data || ({} as IAnimal);
					this.isLoading = false;
				},
				onResponseError: () => {
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
			this.errorMessage = "";
			this.successMessage = "";
			this.veterinarian = {} as IVeterinarian;
		},
	},
});
