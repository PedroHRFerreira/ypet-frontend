export const useSizeEnumStore = defineStore("size-enum", {
	state: () => {
		const sizeEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			sizeEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchSizeEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums/", {
				method: "GET",
				params: {
					group: "size",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.sizeEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar enum de tamanhos.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.sizeEnum.length === 0) {
				await this.fetchSizeEnum();
			}

			const options = this.sizeEnum.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
