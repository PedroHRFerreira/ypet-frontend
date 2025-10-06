export const useDetailStore = defineStore("citizens-detail", {
	state: () => {
		const citizens = ref({} as ICitizens);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			citizens,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchCitizenById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/citizens/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.citizens = result.data || ({} as ICitizens);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Cidadão não encontrado.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao buscar cidadão.";
				},
			});
		},
	},
});
