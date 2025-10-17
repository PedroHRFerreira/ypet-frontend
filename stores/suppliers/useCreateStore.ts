import { useForm } from "~/composables/useForm";

export const useCreateStore = defineStore("supplier-create", {
	state: () => {
		const supplier = ref({} as ISupplier);
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

		return { supplier, isLoading, errorMessage, successMessage, form };
	},
	actions: {
		setFormField(field: string, value: any) {
			this.form[field].value = value;
			this.setFormError(field, []);
		},
		setFormError(field: string, errorMessages: string[]) {
			this.form[field].errorMessages = errorMessages;
		},
		getPayload(): {
			supplier: Record<string, any>;
			contact?: Record<string, any>;
			address?: Record<string, any>;
		} {
			const supplier: Record<string, any> = {};
			const contact: Record<string, any> = {};
			const address: Record<string, any> = {};

			const supplierKeys = [
				"legal_name",
				"business_name",
				"document",
				"municipal_registration",
				"state_registration",
				"representative",
			];

			const contactKeys = ["email", "telephone", "cellphone"];

			const addressKeys = [
				"zip_code",
				"street",
				"number",
				"complement",
				"district",
				"city",
				"state",
				"country",
			];

			for (const key in this.form) {
				if (!Object.prototype.hasOwnProperty.call(this.form, key)) continue;
				const value = this.form[key].value;
				if (value === undefined || value === null) continue;

				if (supplierKeys.includes(key)) {
					supplier[key] = value;
					continue;
				}
				if (contactKeys.includes(key)) {
					contact[key] = value;
					continue;
				}
				if (addressKeys.includes(key)) {
					if (key === "state" && typeof value === "object" && value !== null) {
						address[key] = (value as any).id ?? value;
					} else {
						address[key] = value;
					}
					continue;
				}
			}

			const payload: {
				supplier: Record<string, any>;
				contact?: Record<string, any>;
				address?: Record<string, any>;
			} = { supplier };
			if (Object.keys(contact).length > 0) payload.contact = contact;
			if (Object.keys(address).length > 0) payload.address = address;

			return payload;
		},
		handleResponseError(response: IResponse) {
			if (response.type !== "error") return;

			this.errorMessage =
				response.message || "Erro ao processar a solicitação.";

			if (response.status === 401) {
				this.errorMessage =
					response.message || "Não autorizado. Faça login novamente.";
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
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const payload = this.getPayload();
			await $fetch("/api/suppliers/store", {
				method: "POST",
				body: payload,
				onResponse: async ({ response }) => {
					const responseData = await response._data;

					if (responseData.type === "error")
						return this.handleResponseError(responseData);

					this.successMessage = responseData.message || "Criado com sucesso!";
					this.supplier = responseData.data || ({} as ISupplier);
					this.isLoading = false;

					const router = useRouter();
					router.push({ name: "suppliers-list" });
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
			this.supplier = {} as ISupplier;
		},
	},
});
