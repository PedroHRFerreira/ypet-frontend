import { defineStore } from "pinia";
import type { ILocation } from "~/types/locations";
import type { IResponse } from "~/types/global";

export const useDetailStore = defineStore("locations-detail", {
	state: () => {
		const location = ref<ILocation | null>(null);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			location,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchLocationById(id: string): Promise<void> {
			if (!id) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(`/api/location/${id}`, {
				method: "GET",
				params: {
					"with[]": "addresses",
				},
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.location = result.data || null;
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Local não encontrado.";
						return;
					}

					this.errorMessage =
						response._data?.message || "Erro ao buscar o local.";
				},
			});
		},
	},
});
