export const useMobileEventStatusEnumStore = defineStore(
	"mobile-event-status-enum",
	{
		state: () => {
			const mobileEventStatusEnum = ref([] as IEnum[]);
			const isLoading = ref(false);
			const errorMessage = ref("");

			return {
				mobileEventStatusEnum,
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
						group: "mobile_event_status",
					},
					onResponse: ({ response }) => {
						const result: IResponse = response._data as IResponse;
						this.mobileEventStatusEnum = result.data || [];
						this.isLoading = false;
					},
					onResponseError: ({ response }) => {
						this.isLoading = false;
						this.errorMessage =
							response._data?.message || "Erro ao buscar enum.";
					},
				});
			},
			async getOptions(): Promise<IOption[]> {
				if (this.mobileEventStatusEnum.length === 0) {
					await this.fetchEnum();
				}

				const options = this.mobileEventStatusEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			},
		},
	},
);
