import { defineStore } from "pinia";
import { ref } from "vue";
import type { IPagination } from "~/types/global";
import { useDayjs } from "~/composables/useDayjs";

export const useListStore = defineStore("products-list", {
	state: () => {
		const products = ref([] as IProduct[]);
		const isLoading = ref(false);
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/products";

		// Filtros
		const filterCategory = ref<string>("");
		const filterSearch = ref<string>("");
		const filterStatus = ref<string | number>("");
		const filterManufacturer = ref<string>("");
		const filterSpecies = ref<string>("");
		const perPage = ref<number>(8);
		const currentPage = ref<number>(1);

		return {
			products,
			isLoading,
			errorMessage,
			pagination,
			pathUrl,
			filterCategory,
			filterSearch,
			filterStatus,
			filterManufacturer,
			filterSpecies,
			perPage,
			currentPage,
		};
	},
	actions: {
		setCategory(category: string): void {
			this.filterCategory = category;
		},
		setSearch(text: string): void {
			this.filterSearch = text;
		},
		setStatus(status: string | number): void {
			this.filterStatus = status;
		},
		setManufacturer(text: string): void {
			this.filterManufacturer = text;
		},
		setSpecies(species: string): void {
			this.filterSpecies = species;
		},
		setPerPage(val: number): void {
			this.perPage = val;
		},
		setCurrentPage(page: number): void {
			this.currentPage = page;
		},
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";

			const queryParams: Record<string, any> = {};
			if (this.filterCategory) {
				queryParams["filter[category]"] = this.filterCategory;
			}
			if (this.filterSearch) {
				queryParams["filter[name]"] = this.filterSearch;
			}
			if (this.filterStatus !== "") {
				queryParams["filter[status]"] = this.filterStatus;
			}
			if (this.filterManufacturer) {
				queryParams["filter[manufacturer]"] = this.filterManufacturer;
			}
			if (this.filterSpecies) {
				queryParams["filter[species]"] = this.filterSpecies;
			}
			queryParams.per_page = this.perPage;
			queryParams.page = this.currentPage;

			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
					...queryParams,
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if (result.data?.current_page) {
						this.pagination =
							(result.data as IPagination) || ({} as IPagination);
						const rawProducts = (this.pagination?.data as any[]) || [];
						this.products = rawProducts.map((p: any) => {
							const exp = p?.expiration_date || p?.validity || null;
							const validity = exp
								? useDayjs(exp).tz().format("DD/MM/YYYY")
								: "";
							return {
								...p,
								validity,
								is_active:
									typeof p.is_active !== "undefined" ? p.is_active : p.status,
							} as IProduct;
						});
					} else {
						this.products = (result.data as IProduct[]) || [];
					}
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					const _data: any = response._data;
					this.errorMessage = _data?.message || "Erro ao buscar produtos.";
				},
			});
		},
	},
});
