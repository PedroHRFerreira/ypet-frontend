export const useEditStore = defineStore("edit", {
	state: () => {
		const user = ref({} as IUser);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const pathUrl = "/api/collaborators";

		return {
			user,
			isLoading,
			errorMessage,
			successMessage,
			pathUrl,
		};
	},
	actions: {
		async update(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			await useFetch(`${this.pathUrl}/${this.user.id}`, {
				method: "PUT",
				body: this.user,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.user = result.data || ({} as IUser);
					this.successMessage = "Atualizado com sucesso!";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 422) {
						this.errorMessage = response._data.message || "Erro de validação.";
						return;
					}

					this.errorMessage = response._data.message || "Erro ao atualizar.";
				},
			});
		},
	},
});
