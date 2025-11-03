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
			// Contato
			"email",
			"telephone",
			"cellphone",
			// Endereço
			"zip_code",
			"street",
			"number",
			"complement",
			"district",
			"city",
			"state",
			"country",
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
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			// Build x-www-form-urlencoded payload (with method spoofing) and send via POST
			const onlyDigits = (v: any) =>
				typeof v === "string" ? v.replace(/\D/g, "") : v;
			const val = (k: string) => this.form[k]?.value ?? "";
			const params = new URLSearchParams();
			params.append("_method", "PUT");
			// supplier
			params.append("supplier[legal_name]", String(val("legal_name")));
			params.append("supplier[business_name]", String(val("business_name")));
			params.append("supplier[document]", String(onlyDigits(val("document"))));
			params.append(
				"supplier[municipal_registration]",
				String(val("municipal_registration")),
			);
			params.append(
				"supplier[state_registration]",
				String(val("state_registration")),
			);
			params.append("supplier[representative]", String(val("representative")));
			// contact
			params.append("contact[email]", String(val("email")));
			params.append("contact[telephone]", String(onlyDigits(val("telephone"))));
			params.append("contact[cellphone]", String(onlyDigits(val("cellphone"))));
			// address
			params.append("address[zip_code]", String(onlyDigits(val("zip_code"))));
			params.append("address[street]", String(val("street")));
			params.append("address[number]", String(val("number")));
			params.append("address[complement]", String(val("complement")));
			params.append("address[district]", String(val("district")));
			params.append("address[city]", String(val("city")));
			const stateVal = this.form["state"]?.value;
			params.append(
				"address[state]",
				String(
					typeof stateVal === "object" && stateVal !== null
						? (stateVal as any).id
						: (stateVal ?? ""),
				),
			);
			params.append("address[country]", String(val("country")));

			await useFetch(`/api/suppliers/${supplierId}`, {
				method: "POST",
				body: params,
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
						// Mapear errors para campos do form, se disponível
						if (result.errors) {
							for (const field in result.errors) {
								if (!Object.prototype.hasOwnProperty.call(result.errors, field))
									continue;
								// Campos vêm como 'supplier.legal_name', 'address.zip_code', etc.
								const key = field.split(".").pop() as string;
								if (this.form[key]) {
									this.setFormError(key, (result.errors as any)[field]);
								}
							}
						}
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
				"country",
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
