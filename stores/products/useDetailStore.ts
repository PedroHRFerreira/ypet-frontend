import { defineStore } from "pinia";
import { ref } from "vue";

export const useDetailStore = defineStore("products-detail", {
	state: () => {
		const product = ref({} as IProduct);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pathUrl = "/api/products";

		return {
			product,
			isLoading,
			errorMessage,
			pathUrl,
		};
	},
	actions: {
		async fetchById(id: string | number, params = {}): Promise<void> {
			if (!id || this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(`${this.pathUrl}/${id}`, {
				method: "GET",
				params,
				onResponse: ({ response }) => {
					const result = response._data as IResponse;
					const data = (result?.data || {}) as any;
					// Normaliza status/is_active
					const normalized: IProduct = {
						...data,
						is_active:
							typeof data?.is_active !== "undefined"
								? data.is_active
								: data?.status,
					} as IProduct;

					this.product = normalized;
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;

					if (response.status === 404) {
						this.errorMessage = "Produto não encontrado.";
						return;
					}

					this.errorMessage =
						response._data?.message || "Erro ao buscar produto.";
				},
			});
		},
	},
});
