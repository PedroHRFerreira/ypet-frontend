export const useDetailStore = defineStore("protectors-detail", {
	state: () => {
		const protectors = ref({} as IProtectors);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			protectors,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchProtectorById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/protectors/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.protectors = result.data || ({} as IProtectors);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Protetor não encontrado.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao buscar cidadão.";
				},
			});
		},
	},
});
