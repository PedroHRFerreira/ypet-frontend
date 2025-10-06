export const useAbdominalPalpationEnumStore = defineStore(
	"abdominal-palpation-enum",
	{
		state: () => {
			const abdominalPalpationEnum = ref([] as IEnum[]);
			const isLoading = ref(false);
			const errorMessage = ref("");

			return {
				abdominalPalpationEnum,
				isLoading,
				errorMessage,
			};
		},
		actions: {
			async fetchAbdominalPalpationEnum(): Promise<void> {
				if (this.isLoading) {
					return;
				}

				this.isLoading = true;
				this.errorMessage = "";
				await useFetch("/api/enums", {
					params: { group: "abdominal-palpation" },
					method: "GET",
					onResponse: ({ response }) => {
						const result: IResponse = response._data as IResponse;

						this.abdominalPalpationEnum = result.data || [];
						this.isLoading = false;
					},
					onResponseError: ({ response }) => {
						this.isLoading = false;
						this.errorMessage =
							response._data?.message ||
							"Erro ao buscar enum de palpação abdominal.";
					},
				});
			},
			async getOptions(): Promise<IOption[]> {
				if (this.abdominalPalpationEnum.length === 0) {
					await this.fetchAbdominalPalpationEnum();
				}

				if (
					this.abdominalPalpationEnum &&
					this.abdominalPalpationEnum.length > 0
				) {
					const options = this.abdominalPalpationEnum.map((item) => ({
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
