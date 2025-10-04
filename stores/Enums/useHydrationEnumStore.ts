export const useHydrationEnumStore = defineStore("hydration-enum", {
	state: () => {
		const hydrationEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			hydrationEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchHydrationEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				params: { group: "hydration" },
				method: "GET",
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.hydrationEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar enum de hidratação.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.hydrationEnum.length === 0) {
				await this.fetchHydrationEnum();
			}

			if (this.hydrationEnum && this.hydrationEnum.length > 0) {
				const options = this.hydrationEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			}

			return [] as IOption[];
		},
	},
});
