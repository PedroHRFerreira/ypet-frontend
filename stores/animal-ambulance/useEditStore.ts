import { defineStore } from "pinia";
import { ref } from "vue";

export const useEditStore = defineStore("samupet-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const form = ref<Record<string, any>>({});
		return {
			isLoading,
			errorMessage,
			successMessage,
			form,
		};
	},
	actions: {
		async update(
			samupetId: number | string,
			typeAction: string,
		): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const formData = this.getFormData();

			await useFetch(`/api/animal-ambulance/${samupetId}`, {
				method: "PUT",
				body: formData,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Ocorrência atualizada com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao atualizar ocorrência.";
				},
			});
		},
		setFormField(field: string, value: any) {
			this.form[field].value = value;
			this.setFormError(field, []);
		},
		setFormError(field: string, errors: string[]) {
			this.form[field].errorMessages = errors;
		},
		getFormData(): FormData {
			const formData = new FormData();
			for (const key in this.form) {
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
		resetForm() {
			for (const key in this.form) {
				this.form[key].value = null;
				this.form[key].errorMessages = [];
			}
			this.errorMessage = "";
			this.successMessage = "";
		},
	},
});
