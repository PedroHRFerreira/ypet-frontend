export const useUFEnumStore = defineStore("uf-enum", {
	state: () => {
		const UFEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			UFEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchUFEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "uf",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.UFEnum = result.data || [];
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
			if (this.UFEnum.length === 0) {
				await this.fetchUFEnum();
			}

			const options = this.UFEnum.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
