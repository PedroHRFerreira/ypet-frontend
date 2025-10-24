import { defineStore } from "pinia";
import { useForm } from "~/composables/useForm";

export const useApplicationsCreateStore = defineStore("applications-create", {
	state: () => {
		const application = ref({} as IApplication);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		const form = useForm([
			"animal_id",
			"category",
			"application_date",
			"responsible_name",
			"product_id",
			"product_name",
			"animal_weight",
			"estimated_supply",
			"lot_number",
			"expiration_date",
			"via_administration",
			"next_dose_date",
			"observations",
			"frequency",
			"period_days",
			// suplementos
			"supplement_type",
			"daily_quantity_g_per_kg",
			"meals_per_day",
		]);

		return { application, form, isLoading, errorMessage, successMessage };
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

			const fields = [
				"animal_id",
				"category",
				"application_date",
				"responsible_name",
				"product_id",
				"product_name",
				"animal_weight",
				"estimated_supply",
				"lot_number",
				"expiration_date",
				"via_administration",
				"next_dose_date",
				"observations",
				"frequency",
				"period_days",
				// suplementos
				"supplement_type",
				"daily_quantity_g_per_kg",
				"meals_per_day",
			];

			const dateFields = new Set([
				"application_date",
				"next_dose_date",
				"expiration_date",
			]);

			const toApiDate = (val: string): string => {
				if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
					const [dd, mm, yyyy] = val.split("/");
					return `${yyyy}/${mm}/${dd}`;
				}
				return val;
			};

			for (const key of fields) {
				const value = this.form[key]?.value as any;
				if (value !== null && value !== undefined && value !== "") {
					let str =
						typeof value === "object" && "id" in value
							? String((value as IOption).id)
							: String(value);

					if (dateFields.has(key)) {
						str = toApiDate(str);
					}

					formData.append(key, str);
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

			await useFetch("/api/applications/store", {
				method: "POST",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data as Partial<IResponse>;
					if (responseData.type === "error")
						return this.handleResponseError(responseData);

					this.successMessage =
						responseData.message || "Aplicação registrada com sucesso!";
					this.application = (responseData.data || {}) as IApplication;
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						(response._data as Partial<IResponse>)?.message ||
						"Erro ao registrar aplicação.";
				},
			});
		},

		resetForm() {
			Object.keys(this.form).forEach((key) => {
				this.form[key].value = null;
				this.form[key].errorMessages = [];
			});

			this.application = {} as IApplication;
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
