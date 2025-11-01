import { useForm } from "~/composables/useForm";

export const useEditStore = defineStore("citizens-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"picture",
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
			"city",
			"state",
			"status",
			"can_report_abuse",
			"can_mobile_castration",
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
					const result = response?._data as IResponse;
					this.successMessage =
						result?.message || "Cidadão atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					const result = response?._data as IResponse;

					if (response?.status === 422) {
						this.errorMessage = result?.message || "Erro de validação.";
						return;
					}

					this.errorMessage = result?.message || "Erro ao atualizar cidadão.";
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

			// Envia campos de endereço separados com prefixo address_
			for (const key of addressFields) {
				const value = this.form[key]?.value;
				if (value === null || value === undefined || value === "") continue;
				const normalized =
					typeof value === "object" && "id" in value
						? String(value.id)
						: String(value);
				formData.append(`address_${key}`, normalized);
			}

			for (const key in this.form) {
				if (!Object.prototype.hasOwnProperty.call(this.form, key)) continue;
				if (addressFields.includes(key)) continue;

				const value = this.form[key]?.value;
				if (value === null || value === undefined || value === "") continue;

				if (key === "picture" && typeof value === "string") {
					continue;
				}

				if (value instanceof File) {
					formData.append(key, value);
					continue;
				}

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
