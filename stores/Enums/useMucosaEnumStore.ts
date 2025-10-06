export const useMucosaEnumStore = defineStore("mucosa-enum", {
	state: () => {
		const mucosaEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			mucosaEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchMucosaEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				params: { group: "mucosa" },
				method: "GET",
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.mucosaEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar enum de mucosa.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.mucosaEnum.length === 0) {
				await this.fetchMucosaEnum();
			}

			if (this.mucosaEnum && this.mucosaEnum.length > 0) {
				const options = this.mucosaEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			}

			return [] as IOption[];
		},
	},
});
