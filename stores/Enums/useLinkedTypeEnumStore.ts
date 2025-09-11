export const useLinkedTypeEnumStore = defineStore("linked-type-enum", {
	state: () => {
		const linkedTypeEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			linkedTypeEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "linked_type",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.linkedTypeEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar enum de linked type.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.linkedTypeEnum.length === 0) {
				await this.fetchEnum();
			}

			const options = this.linkedTypeEnum.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
