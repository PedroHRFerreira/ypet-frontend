export const useEditTypeStore = defineStore("abuse-report-type-edit", {
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
			lostPetId: number | string,
			typeAction: string,
		): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`/api/lost-pet/${lostPetId}/${typeAction}`, {
				method: "POST",
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Ocorrência atualizado com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao atualizar ocorrência.";
				},
			});
		},
	},
});
