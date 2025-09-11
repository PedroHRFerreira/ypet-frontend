export const useDetailStore = defineStore("veterinarians-detail", {
	state: () => {
		const veterinarian = ref({} as IVeterinarian);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			veterinarian,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async find(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/veterinarians/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.veterinarian = result.data || ({} as IVeterinarian);
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
