import { useForm } from "~/composables/useForm";

export const useAnimalsCreateStore = defineStore("animals-create", {
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
			"birth_date",
			"entry_date",
			"status",
			"castration_site",
			"collection_reason",
			"collection_site",
			"registration_number",
			"microchip_number",
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
		async createAnimal(): Promise<void> {
			console.log("Creating animal with data:", this.form);
			return;
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			await useFetch("/api/animals/store", {
				method: "POST",
				body: this.animal,
				onResponse: ({ response }) => {
					this.successMessage = "Animal criado com sucesso!";
					const result = response._data as IResponse;
					this.animal = result.data || ({} as IAnimal);
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						this.isLoading = false;

						return;
					}

					this.errorMessage = response._data.message || "Erro ao criar animal.";
					this.isLoading = false;
				},
			});
		},
	},
});
