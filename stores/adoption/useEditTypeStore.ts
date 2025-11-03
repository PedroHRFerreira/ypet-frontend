export const useEditTypeStore = defineStore("adoption-visits-type-edit", {
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
			await useFetch(`/api/adoptions/${adoptionId}/${typeAction}`, {
				method: "POST",
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Cidadão atualizado com sucesso.";
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
		async updateAnimal(animalId: number | string): Promise<void> {
			if (this.isLoading) {
				return;
			}

			const data = new FormData();
			data.append("status", "adopted");

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`/api/animals/${animalId}`, {
				method: "PUT",
				body: data,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Animal atualizado com sucesso.";
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
