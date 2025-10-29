import { useForm } from "~/composables/useForm";

export const useEditStore = defineStore("suppliers-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"legal_name",
			"business_name",
			"document",
			"municipal_registration",
			"state_registration",
			"representative",
			// Dados Bancários
			"cpf_cnpj",
			"account_type",
			"pix_key",
			"bank_account_type",
			"bank",
			"agency",
			"account_number",
			"account_holder",
		]);

		return {
			form,
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async update(supplierId: string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const formData = this.getFormData();

			await useFetch(`/api/suppliers/${supplierId}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Fornecedor atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					const result = response._data as IResponse;
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = result.message || "Erro de validação.";
						return;
					}

					this.errorMessage = result.message || "Erro ao atualizar fornecedor.";
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

			const addressObj: Record<string, any> = {};
			for (const key of addressFields) {
				const value = this.form[key]?.value;
				if (value !== null && value !== undefined && value !== "") {
					addressObj[key] =
						typeof value === "object" && "id" in value ? value.id : value;
				}
			}

			formData.append("address", JSON.stringify([addressObj]));

			for (const key in this.form) {
				if (!Object.prototype.hasOwnProperty.call(this.form, key)) continue;
				if (addressFields.includes(key)) continue; // já foi adicionado no endereço

				const value = this.form[key]?.value;
				if (value === null || value === undefined || value === "") continue;

				formData.append(
					key,
					typeof value === "object" && "id" in value
						? String(value.id)
						: String(value),
				);
			}

			formData.append("special_permissions", "0");

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
