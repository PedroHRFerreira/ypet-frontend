export const useDetailStore = defineStore("animals-detail", {
	state: () => {
		const animal = ref({} as IAnimal);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			animal,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchAnimalById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/animals/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.animal = result.data || ({} as IAnimal);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Animal não encontrado.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao buscar animal.";
				},
			});
		},
	},
});
