import { defineStore } from "pinia";
import type { IPagination } from "~/types/global";
import type { ILocation } from "~/types/locations";

export const useLocationsStore = defineStore("locations-store", {
	state: () => ({
		locations: [] as ILocation[],
		meta: {
			total: 0,
			current_page: 1,
			per_page: 10,
			from: 1,
			to: 0,
			last_page: 1,
			first_page_url: "",
			last_page_url: "",
			next_page_url: null,
			prev_page_url: null,
			path: "",
			links: [],
			data: [],
		} as IPagination,
		filters: {
			name: null as string | null,
			location_type: null as string | null,
			status: null as number | null,
		},
		isLoading: false,
		errorMessage: "",
	}),
	actions: {
		async fetchLocations(page: number = 1): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			const activeFilters = Object.fromEntries(
				Object.entries(this.filters).filter(([_, value]) => value !== null),
			);

			await useFetch("/api/location", {
				method: "GET",
				params: { page, ...activeFilters },
				onResponse: ({ response }) => {
					const data: IPagination = response._data;
					this.meta = data || ({} as IPagination);
					this.locations = data?.data?.data || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar os locais.";
				},
			});
		},

		changePage(page: number) {
			this.meta.current_page = page;
			this.fetchLocations(page);
		},
	},
});
