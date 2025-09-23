export const useDetailStore = defineStore("clinic-events-detail", {
	state: () => {
		const data = ref({} as IMobileClinicEvent);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			data,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchById(id: string | number, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/clinic-events/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.data = result.data || ({} as IMobileClinicEvent);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Evento não encontrado.";
						return;
					}

					this.errorMessage =
						response._data.message || "Erro ao buscar Evento Clinico.";
				},
			});
		},
	},
});
