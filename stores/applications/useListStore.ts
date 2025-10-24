import { ref } from "vue";
import { defineStore } from "pinia";
import type { IPagination } from "~/types/global";

export const useListStore = defineStore("applications-list", {
	state: () => {
		const applications = ref([] as IApplication[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		return {
			applications,
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

			await useFetch("/api/applications", {
				method: "GET",
				params: {
					...params,
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.applications = (this.pagination?.data as IApplication[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = (response as any)?._data?.message || "Erro ao buscar.";
				},
			});

		},
	},
});