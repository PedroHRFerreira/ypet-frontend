export const useDetailStore = defineStore("registration-detail", {
	state: () => {
		const data = ref({} as IRegistration);
		const dataSurgery = ref({} as any);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			data,
			dataSurgery,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchById(id: string | number, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await useFetch(`/api/registrations/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.data = result.data || ({} as IMobileClinicEvent);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					this.errorMessage = response._data.message;
				},
			});
		},
	},
});
