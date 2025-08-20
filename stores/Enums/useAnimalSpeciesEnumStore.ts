export const useAnimalSpeciesEnumStore = defineStore("animal-species-enum", {
	state: () => {
		const animalSpeciesEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			animalSpeciesEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchAnimalSpeciesEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				params: { group: "animal-species" },
				method: "GET",
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.animalSpeciesEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message ||
						"Erro ao buscar enum de status de animais.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.animalSpeciesEnum.length === 0) {
				await this.fetchAnimalSpeciesEnum();
			}

			if (this.animalSpeciesEnum && this.animalSpeciesEnum.length > 0) {
				const options = this.animalSpeciesEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			}

			return [] as IOption[];
		},
	},
});
