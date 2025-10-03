import { useForm } from "~/composables/useForm";

export const useEditStore = defineStore("citizens-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"name",
			"document",
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
			"can_mobile_castration"
		]);

		return {
			form,
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async update(citizenId: number | string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const formData = this.getFormData();

			await useFetch(`/api/citizens/${citizenId}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Cidadão atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao atualizar cidadão.";
				},
			});
		},
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
		
			return formData;
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
		},
	},
});
