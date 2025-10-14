import type { IPagination } from "~/types/global";

export const useListStore = defineStore("protectors-list", {
	state: () => {
		const protectors = ref([] as IProtectors[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		return {
			protectors,
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

			await useFetch("/api/protectors", {
				method: "GET",
				params: {
					...params,
					"with[]": ["user"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.protectors = (this.pagination?.data as IProtectors[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message || "Erro ao buscar.";
				},
			});
		},
	},
});
