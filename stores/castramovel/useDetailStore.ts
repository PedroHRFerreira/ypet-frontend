export const useDetailStore = defineStore("castramovel-detail", {
	state: () => {
		const report = ref({} as ICastraMovel);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			report,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchCastramovelById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/castramovel/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.report = result.data || ({} as ICastraMovel);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Pet não encontrado.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao buscar cidadão.";
				},
			});
		},
	},
});
