import { defineStore } from "pinia";
import { ref } from "vue";
import type { IPagination } from "~/types/global";

export const useListStore = defineStore("procedures-list", {
	state: () => {
		const procedures = ref([] as IProcedure[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/procedures";

		return {
			procedures,
			isLoading,
			errorMessage,
			pagination,
			pathUrl,
		};
	},
	actions: {
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					"with[]": ["animal"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					const data = (result.data as IPagination) || ({} as IPagination);
					this.pagination = data;
					this.procedures = (data?.data as IProcedure[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					const _data: any = (response as any)?._data;
					this.errorMessage = _data?.message || "Erro ao buscar procedimentos.";
				},
			});
		},
	},
});
