import { useForm } from "~/composables/useForm";

export const useCreateStore = defineStore("animals-create", {
	state: () => {
		const animal = ref({} as IAnimal);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = useForm([
			"name",
			"species",
			"gender",
			"weight",
			"castrated",
			"dewormed",
			"size",
			"birth_date",
			"entry_date",
			"status",
			"characteristics",
			"suname",
			"infirmity",
			"color",
			"coat",
			"microchip_number",
			"registration_number",
		]);

		return {
			animal,
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
		async createAnimal(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = this.getFormData();

			await useFetch("/api/animals/store", {
				method: "POST",
				body: formData,
				onResponse: ({ response }) => {
					const responseData = response._data || ({} as IResponse);

					if (responseData.type === "error") {
						return this.handleResponseError(responseData);
					}

					this.successMessage =
						responseData.message || "Animal criado com sucesso!";
					this.animal = responseData.data || ({} as IAnimal);
					this.isLoading = false;

					const router = useRouter();
					router.push({ name: "animals-list" });
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
			this.animal = {} as IAnimal;
		},
	},
});
