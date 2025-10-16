export const useDetailStore = defineStore("suppliers-detail", {
	state: () => {
		const supplier = ref({} as ISupplier);
		const isLoading = ref(false);
		const errorMessage = ref("");

		return {
			supplier,
			isLoading,
			errorMessage,
		};
	},
	actions: {
		async fetchSupplierById(id: string, params = {}): Promise<void> {
			if (!id) {
				return;
			}

			await $fetch(`/api/suppliers/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					this.supplier = result.data || ({} as ISupplier);
					console.log("detalhes", this.supplier);
					this.errorMessage = "";
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					const result = response._data as IResponse;
					this.isLoading = false;

					if (result.status === 404) {
						this.errorMessage = "Fornecedor não encontrado.";
						return;
					}

					this.errorMessage = result.message || "Erro ao buscar fornecedor.";
				},
			});
		},
	},
});
