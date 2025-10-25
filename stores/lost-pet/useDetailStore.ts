export const useDetailStore = defineStore("lost-pet-detail", {
	state: () => {
		const lostPet = ref({} as ILostPet);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			lostPet,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchLostPetById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/lost-pet/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.lostPet = result.data || ({} as ILostPet);
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
