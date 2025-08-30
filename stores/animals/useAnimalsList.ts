import type { IPagination } from "~/types/global";

export const useAnimalsList = defineStore("animals-list", {
	state: () => {
		const animals = ref([] as IAnimal[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);

		return {
			animals,
			isLoading,
			errorMessage,
			pagination,
		};
	},
	actions: {
		async fetchAnimals(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/animals", {
				method: "GET",
				params: {
					...params,
					"with[]": "status",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.animals = (this.pagination?.data as IAnimal[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar animais.";
				},
			});
		},
	},
});
