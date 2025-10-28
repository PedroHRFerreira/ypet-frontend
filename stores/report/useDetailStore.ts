export const useDetailStore = defineStore("abuse-report-detail", {
	state: () => {
		const report = ref({} as IReport);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			report,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchReportById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/report/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.report = result.data || ({} as IReport);
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
