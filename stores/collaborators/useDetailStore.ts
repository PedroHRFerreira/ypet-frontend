export const useDetailStore = defineStore("detail", {
	state: () => {
		const detail = ref({} as ICollaborator);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pathUrl = "/api/collaborators";

		return {
			detail,
			isLoading,
			errorMessage,
			pathUrl,
		};
	},
	actions: {
		async fetchById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`${this.pathUrl}/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.detail = result.data || ({} as ICollaborator);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Não encontrado.";
						return;
					}

					this.errorMessage = response._data.message || "Erro ao buscar.";
				},
			});
		},
	},
});
