import { defineStore } from "pinia";
import { useForm } from "~/composables/useForm";
import type { IResponse } from "~/types/global";
import type { IAddress, ILocation, IFormFields } from "~/types/locations";

export const useCreateStore = defineStore("locations-create", {
	state: () => {
		const location = ref({} as ILocation);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		const form = useForm([
			"location_name",
			"location_type",
			"responsible_name",
			"phone",
			"email",
			"cnpj",
			"bank_account_or_pix",
			"status",
			"notes",
			"address_street",
			"address_number",
			"address_zipcode",
			"address_neighborhood",
			"address_city",
			"address_state",
			"address_complement",
		]);

		return { location, form, isLoading, errorMessage, successMessage };
	},

	actions: {
		setFormField(field: string, value: any) {
			if (this.form[field]) {
				this.form[field].value = value;
				this.setFormError(field, []);
			}
		},

		setFormError(field: string, errors: string[]) {
			if (this.form[field]) {
				this.form[field].errorMessages = errors;
			}
		},

		getFormData(): FormData {
			const formData = new FormData();

			const address: IAddress = {
				street: String(this.form.address_street?.value || ""),
				number: String(this.form.address_number?.value || ""),
				zipcode: String(this.form.address_zipcode?.value || ""),
				neighborhood: String(this.form.address_neighborhood?.value || ""),
				city: String(this.form.address_city?.value || ""),
				state: String(this.form.address_state?.value || ""),
				complement: String(this.form.address_complement?.value || ""),
			};

			formData.append("address", JSON.stringify(address));

			const mainFields = [
				"location_name",
				"location_type",
				"responsible_name",
				"phone",
				"email",
				"cnpj",
				"bank_account_or_pix",
				"status",
				"notes",
			];

			for (const key of mainFields) {
				const value = this.form[key]?.value;
				if (value !== null && value !== undefined && value !== "") {
					formData.append(
						key,
						typeof value === "object" && "id" in value
							? String(value.id)
							: String(value),
					);
				}
			}

			return formData;
		},

		handleResponseError(response: Partial<IResponse>) {
			if (response.type !== "error") return;

			this.errorMessage =
				response.message || "Erro ao processar a solicitação.";

			if (response.status === 401) {
				this.errorMessage =
					response.message || "Não autorizado. Faça login novamente.";
			}

			if (response.status === 422 && response.errors) {
				for (const field in response.errors) {
					if (Object.prototype.hasOwnProperty.call(response.errors, field)) {
						this.setFormError(field, response.errors[field]);
					}
				}
			}

			this.isLoading = false;
		},

		async create() {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch("/api/location/store", {
				method: "POST",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data as Partial<IResponse>;
					if (responseData.type === "error")
						return this.handleResponseError(responseData);

					this.successMessage =
						responseData.message || "Local criado com sucesso!";
					this.location = responseData.data || ({} as ILocation);
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						(response._data as Partial<IResponse>)?.message ||
						"Erro ao cadastrar local.";
				},
			});
		},

		resetForm() {
			const allFields = Object.keys(this.form);
			allFields.forEach((key) => {
				this.form[key].value = null;
				this.form[key].errorMessages = [];
			});

			this.location = {} as ILocation;
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
