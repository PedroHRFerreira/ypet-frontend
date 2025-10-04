export const usePalpationOfLymphNodesEnumStore = defineStore(
	"palpation-lymph-nodes-enum",
	{
		state: () => {
			const palpationOfLymphNodesEnum = ref([] as IEnum[]);
			const isLoading = ref(false);
			const errorMessage = ref("");

			return {
				palpationOfLymphNodesEnum,
				isLoading,
				errorMessage,
			};
		},
		actions: {
			async fetchPalpationOfLymphNodesEnum(): Promise<void> {
				if (this.isLoading) {
					return;
				}

				this.isLoading = true;
				this.errorMessage = "";
				await useFetch("/api/enums", {
					params: { group: "palpation-of-lymph-nodes" },
					method: "GET",
					onResponse: ({ response }) => {
						const result: IResponse = response._data as IResponse;

						this.palpationOfLymphNodesEnum = result.data || [];
						this.isLoading = false;
					},
					onResponseError: ({ response }) => {
						this.isLoading = false;
						this.errorMessage =
							response._data?.message ||
							"Erro ao buscar enum de palpação de linfonodos.";
					},
				});
			},
			async getOptions(): Promise<IOption[]> {
				if (this.palpationOfLymphNodesEnum.length === 0) {
					await this.fetchPalpationOfLymphNodesEnum();
				}

				if (
					this.palpationOfLymphNodesEnum &&
					this.palpationOfLymphNodesEnum.length > 0
				) {
					const options = this.palpationOfLymphNodesEnum.map((item) => ({
						id: item.value,
						text: item.label,
					}));

					return options || ([] as IOption[]);
				}

				return [] as IOption[];
			},
		},
	},
);
