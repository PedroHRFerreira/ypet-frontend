export const useEditTypeStore = defineStore("evaluation-pet-type-edit", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		return {
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async update(
			adoptionId: number | string,
			typeAction: string,
		): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`/api/evaluation-pet/${adoptionId}/${typeAction}`, {
				method: "POST",
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Avaliação atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao atualizar cidadão.";
				},
			});
		},
	},
});
