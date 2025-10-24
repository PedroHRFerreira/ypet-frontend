import { defineStore } from "pinia";
import { ref } from "vue";

export const useDetailStore = defineStore("samupet-detail", {
	state: () => {
		const samupet = ref({} as IEvaluationPet[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		return {
			samupet,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchById(id: string, params = {}): Promise<void> {
			if (!id) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(`/api/animal-ambulance/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.samupet = result.data || ({} as ISamuPet);
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					if (response.status === 404) {
						this.errorMessage = "Ocorrência não encontrada.";
						return;
					}
					this.errorMessage =
						response._data?.message || "Erro ao buscar ocorrência.";
				},
			});
		},
	},
});
