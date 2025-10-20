import { defineStore } from "pinia";
import { useForm } from "~/composables/useForm";
import type { IResponse } from "~/types/global";
import type { IAddress, ILocation } from "~/types/locations";

export const useEditStore = defineStore("locations-edit", {
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

		async fetchLocation(id: number | string) {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(`/api/location/${id}`, {
				method: "GET",
				onResponse: ({ response }) => {
					const responseData = response._data as Partial<IResponse>;

					if (responseData.type === "error") {
						this.handleResponseError(responseData);
						return;
					}

					this.location = responseData.data as ILocation;

					this.form.location_name.value = this.location.location_name || "";
					this.form.location_type.value = this.location.location_type || "";
					this.form.responsible_name.value =
						this.location.responsible_name || "";
					this.form.phone.value = this.location.phone || "";
					this.form.email.value = this.location.email || "";
					this.form.cnpj.value = this.location.cnpj || "";
					this.form.bank_account_or_pix.value =
						this.location.bank_account_or_pix || "";
					this.form.status.value = this.location.status || "";
					this.form.notes.value = this.location.notes || "";

					const address = this.location.address || {};
					this.form.address_street.value = address.street || "";
					this.form.address_number.value = address.number || "";
					this.form.address_zipcode.value = address.zipcode || "";
					this.form.address_neighborhood.value = address.neighborhood || "";
					this.form.address_city.value = address.city || "";
					this.form.address_state.value = address.state || "";
					this.form.address_complement.value = address.complement || "";

					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao carregar o local.";
				},
			});
		},

		async update(id: number | string) {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch(`/api/location/${id}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data as Partial<IResponse>;

					if (responseData.type === "error") {
						this.handleResponseError(responseData);
						return;
					}

					this.successMessage =
						responseData.message || "Local atualizado com sucesso!";
					this.location = responseData.data as ILocation;
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao atualizar local.";
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
			this.location = {} as ILocation;
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
