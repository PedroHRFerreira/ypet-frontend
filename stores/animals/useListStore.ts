import { ref } from "vue";
import { defineStore } from "pinia";
import type { IPagination } from "~/types/global";

export const useListStore = defineStore("animals-list", {
	state: () => {
		const animals = ref([] as IAnimal[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/animals";

		const filters = ref({
			name: null as string | null,
			species: null as string | null,
			registration_number: null as string | null,
		});

		return {
			animals,
			isLoading,
			errorMessage,
			pagination,
			pathUrl,
			filters,
		};
	},
	actions: {
		async fetchAnimals(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";

			const queryParams: Record<string, any> = {
				...params,
				"with[]": ["status", "entryData", "tutor"],
			};

			if (this.filters.name !== null) {
				queryParams.name = this.filters.name;
			}
			if (this.filters.species !== null) {
				queryParams.species = this.filters.species;
			}
			if (this.filters.registration_number !== null) {
				queryParams.registration_number = this.filters.registration_number;
			}

			await useFetch(this.pathUrl, {
				method: "GET",
				params: queryParams,
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if (result.data?.current_page) {
						this.pagination =
							(result.data as IPagination) || ({} as IPagination);
						this.animals = (this.pagination?.data as IAnimal[]) || [];
					} else {
						this.animals = (result.data as IAnimal[]) || [];
					}
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						(response._data as any)?.message || "Erro ao buscar animais.";
				},
			});
		},
		async fetchAnimalsTotalCount(params: Record<string, any> = {}): Promise<number> {
			let count = 0;
			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					per_page: 1,
					"with[]": ["status", "entryData", "tutor"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if ((result.data as any)?.current_page) {
						const p = (result.data as IPagination) || ({} as IPagination);
						count = (p as any)?.total || (p?.data as any[])?.length || 0;
					} else {
						const list = (result.data as IAnimal[]) || [];
						count = list.length;
					}
				},
				onResponseError: () => {
					count = 0;
				},
			});
			return count;
		},
		async fetchAnimalsWithOwnerCount(params: Record<string, any> = {}): Promise<number> {
			let count = 0;
			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					status: "with_owner",
					per_page: 1,
					"with[]": ["status", "entryData", "tutor"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if ((result.data as any)?.current_page) {
						const p = (result.data as IPagination) || ({} as IPagination);
						count = (p as any)?.total || (p?.data as any[])?.length || 0;
					} else {
						const list = (result.data as IAnimal[]) || [];
						count = list.length;
					}
				},
				onResponseError: () => {
					count = 0;
				},
			});
			return count;
		},
		async fetchAnimalsForAdoptionCount(params: Record<string, any> = {}): Promise<number> {
			let count = 0;
			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					status: "for_adoption",
					per_page: 1,
					"with[]": ["status", "entryData", "tutor"],
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if ((result.data as any)?.current_page) {
						const p = (result.data as IPagination) || ({} as IPagination);
						count = (p as any)?.total || (p?.data as any[])?.length || 0;
					} else {
						const list = (result.data as IAnimal[]) || [];
						count = list.length;
					}
				},
				onResponseError: () => {
					count = 0;
				},
			});
			return count;
		},
	},
});
