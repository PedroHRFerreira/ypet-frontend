export const useEditTypeStore = defineStore("castramovel-edit", {
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
		async update(id: number | string, status: string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`/api/castramovel/${id}`, {
				method: "PUT",
				body: { status },
				onResponse: ({ response }) => {
					this.successMessage = "Atualizado com sucesso!";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage = response._data.message || "Erro ao atualizar.";
				},
			});
		},
	},
});
