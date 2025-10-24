export const useDetailStore = defineStore("abuse-report-detail", {
	state: () => {
		const adoption = ref({} as IAdoption);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			adoption,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchAdoptionById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/abuse-report/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.adoption = result.data || ({} as IAdoption);
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
