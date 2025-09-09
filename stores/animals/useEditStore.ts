import { useForm } from "~/composables/useForm";

export const useEditStore = defineStore("animals-edit", {
	state: () => {
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
			"surname",
			"infirmity",
			"color",
			"coat",
			"microchip_number",
			"registration_number",
		]);

		return {
			form,
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async update(animalId: number | string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const formData = this.getFormData();

			await useFetch(`/api/animals/${animalId}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.data.message || "Animal atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao atualizar animal.";
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
