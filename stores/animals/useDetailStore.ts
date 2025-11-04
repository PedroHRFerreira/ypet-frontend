export const useDetailStore = defineStore("animals-detail", {
	state: () => {
		const animal = ref({} as IAnimal);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const history = ref([] as any[]);
		const historyPagination = ref<IPagination>({} as IPagination);

		return {
			animal,
			isLoading,
			errorMessage,
			history,
			historyPagination,
		};
	},
	actions: {
		async fetchAnimalById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/animals/${id}`, {
				method: "GET",
				params: {
					...params,
					"with[]": ["location", "entryData", "status", "tutor"],
				},
				onResponse: ({ response }) => {
					const result = response._data as unknown as IResponse;
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

					const errData = (response._data as any) || {};
					this.errorMessage = errData?.message || "Erro ao buscar animal.";
				},
			});
		},

		async fetchAnimalHistory(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/animals/${id}/history`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as unknown as IResponse;
					const pagination =
						(result.data as IPagination) || ({} as IPagination);
					this.historyPagination = pagination;
					this.history = (pagination?.data as any[]) || [];
					this.errorMessage = "";
				},
				onResponseError: ({ response }) => {
					if (response.status === 404) {
						this.errorMessage = "Histórico não encontrado.";
						return;
					}

					const errData = (response._data as any) || {};
					this.errorMessage =
						errData?.message || "Erro ao buscar histórico do animal.";
				},
			});
		},
	},
});
