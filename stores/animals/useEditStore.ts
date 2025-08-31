export const useEditStore = defineStore("animals-edit", {
	state: () => {
		const animal = ref({} as IAnimal);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");

		return {
			animal,
			isLoading,
			errorMessage,
			successMessage,
		};
	},
	actions: {
		async updateAnimal(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`/api/animals/${this.animal.id}`, {
				method: "PUT",
				body: this.animal,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.animal = result.data || ({} as IAnimal);
					this.successMessage = "Animal atualizado com sucesso!";
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
	},
});
