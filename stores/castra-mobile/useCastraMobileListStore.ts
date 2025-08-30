export const useCastraMobileList = defineStore("castra-mobile-list", {
	state: () => {
		const settingsList = ref([]);
		const dailyScheduleList = ref([]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			dailyScheduleList,
			settingsList,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchSettings(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/castra-mobile/settings", {
				method: "GET",
				params: {
					...params,
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.settingsList = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro realizar a busca.";
				},
			});
		},
		async fetchDailySchedule(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/castra-mobile/daily-schedule", {
				method: "GET",
				params: {
					...params,
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.dailyScheduleList = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro realizar a busca.";
				},
			});
		},
	},
});
