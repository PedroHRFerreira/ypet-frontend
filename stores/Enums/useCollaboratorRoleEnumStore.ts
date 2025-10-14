export const useCollaboratorRoleEnumStore = defineStore(
	"collaborator-roles-enum",
	{
		state: () => {
			const rolesEnum = ref([] as IEnum[]);
			const isLoading = ref(false);
			const errorMessage = ref("");

			return {
				rolesEnum,
				isLoading,
				errorMessage,
			};
		},
		actions: {
			async fetchRolesEnum(): Promise<void> {
				if (this.isLoading) {
					return;
				}

				this.isLoading = true;
				this.errorMessage = "";
				await useFetch("/api/enums", {
					method: "GET",
					params: {
						group: "collaborator_role",
					},
					onResponse: ({ response }) => {
						const result: IResponse = response._data as IResponse;
						this.rolesEnum = result.data || [];
						this.isLoading = false;
					},
					onResponseError: ({ response }) => {
						this.isLoading = false;
						this.errorMessage =
							response._data?.message || "Erro ao buscar enum de papéis.";
					},
				});
			},
			async getOptions(): Promise<IOption[]> {
				if (this.rolesEnum.length === 0) {
					await this.fetchRolesEnum();
				}

				const options = this.rolesEnum.map((item) => ({
					id: item.value,
					text: item.label,
				}));

				return options || ([] as IOption[]);
			},
		},
	},
);
