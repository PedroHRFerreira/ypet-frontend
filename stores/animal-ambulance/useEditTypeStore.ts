import { defineStore } from "pinia";
import { ref } from "vue";

export const useEditTypeStore = defineStore("samupet-type-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		return { isLoading, errorMessage, successMessage };
	},
	actions: {
		async updateStatus(
			samupetId: string | number,
			status: string,
		): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			const formData = new FormData();
			formData.append("status", status);

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
	},
});
