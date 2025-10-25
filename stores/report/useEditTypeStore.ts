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
		async update(reportUuid: string | number, action: string): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			await useFetch(`/api/reports/${reportUuid}/${action}`, {
				method: "POST",
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.successMessage =
						result.message || "Ocorrência atualizada com sucesso.";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao atualizar ocorrência.";
				},
			});
		},
	},
});
