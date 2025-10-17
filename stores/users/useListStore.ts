import type { IPagination } from "~/types/global";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useListStore = defineStore("users-list", {
	state: () => {
		const list = ref([] as IUser[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/users";

		return {
			list,
			isLoading,
			errorMessage,
			pagination,
			pathUrl,
		};
	},
	actions: {
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					"with[]": "status",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.list = (this.pagination?.data as IUser[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message || "Erro ao buscar list.";
				},
			});
		},
	},
});
