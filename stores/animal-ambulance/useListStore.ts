import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type { IPagination } from "~/types/global";

export const useListStore = defineStore("samupet-list", {
	state: () => {
		const samupet = ref([] as IEvaluationPet[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		const filters = reactive({
			name: null as string | null,
			status: null as string | null,
			date: null as string | null,
		});

		return {
			samupet,
			isLoading,
			errorMessage,
			pagination,
			filters,
		};
	},
	actions: {
		async fetchList(page = 1): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch("/api/animal-ambulance", {
				method: "GET",
				params: {
					page,
					name: this.filters.name || undefined,
					status: this.filters.status || undefined,
					date: this.filters.date || undefined,
					"with[]": ["user"],
				},
				onResponse: ({ response }) => {
					const result = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.samupet = (this.pagination?.data as ISamuPet[]) || [];
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
