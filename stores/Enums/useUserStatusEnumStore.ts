export const useUserStatusEnumStore = defineStore("user-status-enum", {
	state: () => {
		const userStatusEnum = ref([] as IEnum[]);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			userStatusEnum,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchUserStatusEnum(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch("/api/enums", {
				method: "GET",
				params: {
					group: "user_status",
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					this.userStatusEnum = result.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message ||
						"Erro ao buscar enum de status de usuário.";
				},
			});
		},
		async getOptions(): Promise<IOption[]> {
			if (this.userStatusEnum.length === 0) {
				await this.fetchUserStatusEnum();
			}

			const options = this.userStatusEnum.map((item) => ({
				id: item.value,
				text: item.label,
			}));

			return options || ([] as IOption[]);
		},
	},
});
