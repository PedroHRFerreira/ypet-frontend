export const useBooleanEnumStore = defineStore("boolean-enum", {
	state: () => {
		const booleanEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			booleanEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchBooleanEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "boolean",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.booleanEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar enum de UF.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.booleanEnum.length === 0) {
				await this.fetchBooleanEnum();
			}

			const options = this.booleanEnum.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
