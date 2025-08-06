export const useAnimalStatusEnumStore = defineStore("animal-status-enum", {
	state: () => {
		const animalStatusEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			animalStatusEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchAnimalStatusEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "animal_status",
				},
				onResponse: ({ request, response, options }) => {
					const result: IResponse = response._data as IResponse;

					this.animalStatusEnum = result.data || [];
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
			if (this.animalStatusEnum.length === 0) {
				await this.fetchAnimalStatusEnum();
			}

			if (this.animalStatusEnum && this.animalStatusEnum.length > 0) {
				const options = this.animalStatusEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			}

			return [] as IOption[];
		},
	},
});
