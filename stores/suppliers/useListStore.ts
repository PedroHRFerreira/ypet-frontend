import type { IPagination } from "~/types/global";

export const useListStore = defineStore("suppliers-list", {
	state: () => {
		const suppliers = ref([] as ISupplier[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		return {
			suppliers,
			isLoading,
			errorMessage,
			pagination,
		};
	},
	actions: {
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch("/api/suppliers", {
				method: "GET",
				params: {
					...params,
					"with[]": ["contacts", "addresses"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					console.log("result", result, response._data);

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.suppliers = (this.pagination?.data as ISupplier[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					const result = response._data as IResponse;
					this.isLoading = false;
					this.errorMessage = result?.message || "Erro ao buscar.";
				},
			});
		},
	},
});
