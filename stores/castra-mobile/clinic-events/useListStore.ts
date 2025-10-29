import type { IPagination } from "~/types/global";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useListStore = defineStore("clinic-events-list", {
	state: () => {
		const list = ref([] as IMobileClinicEvent[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/clinic-events";

		const filters = ref({
			date: null as string | null,
			status: null as number | null,
		});

		return {
			list,
			isLoading,
			errorMessage,
			pagination,
			pathUrl,
			filters,
		};
	},
	actions: {
		async fetchListWithoutPagination(params = {}): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			const queryParams: Record<string, any> = {
				...params,
				without_pagination: true,
			};

			if (this.filters.date) queryParams.start_date = this.filters.date;
			if (this.filters.status) queryParams.status = this.filters.status;

			await useFetch(this.pathUrl, {
				method: "GET",
				params: queryParams,
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.list = (result.data as IMobileClinicEvent[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message;
				},
			});
		},
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			const queryParams: Record<string, any> = {
				...params,
				"with[]": ["location"],
			};

			if (this.filters.date) queryParams.start_date = this.filters.date;
			if (this.filters.status) queryParams.status = this.filters.status;

			await useFetch(this.pathUrl, {
				method: "GET",
				params: queryParams,
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.list = (this.pagination?.data as IMobileClinicEvent[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message;
				},
			});
		},
	},
});
