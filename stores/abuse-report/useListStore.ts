import type { IPagination } from "~/types/global";

export const useListStore = defineStore("abuse-report-list", {
	state: () => {
		const lostPet = ref([] as ILostPet[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		return {
			lostPet,
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

			await useFetch("/api/lost-pet", {
				method: "GET",
				params: {
					...params,
					"with[]": ["user","citizen", "animal"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.lostPet = (this.pagination?.data as ILostPet[]) || [];
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
