import type { IPagination } from "~/types/global";

export const useListStore = defineStore("list", {
	state: () => {
		const list = ref([] as IMobileClinicEvent[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/clinic-events";

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
				},
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
