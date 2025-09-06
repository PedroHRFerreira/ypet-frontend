export const useAnimalSizeEnumStore = defineStore("animal-size-enum", {
	state: () => {
		const enums = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
      enums,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchEnums(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "size",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.enums = result.data || [];
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
			if (this.enums.length === 0) {
				await this.fetchEnums();
			}

			if (this.enums && this.enums.length === 0) {
				return [] as IOption[];
			}

			const options = this.enums.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
