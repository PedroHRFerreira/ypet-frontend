import { defineStore } from "pinia";
import { ref } from "vue";
import type { IPagination, IOption } from "~/types/global";

export const useListStore = defineStore("list-registrations", {
	state: () => {
		const list = ref([] as IRegistration[]);
		const tutors = ref<IOption[]>([]);
		const isLoading = ref(false);
		const isDownloading = ref(false);
		const errorDownloadingMessage = ref("");
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/registrations";

		const filters = ref({
			start_date: null as string | null,
			species: "" as string,
			status: 'pending' as string,
			tutor: "" as string,
		});

		return {
			list,
			isLoading,
			isDownloading,
			errorMessage,
			errorDownloadingMessage,
			pagination,
			pathUrl,
			tutors,
			filters,
		};
	},

	actions: {
		async fetchList(page: number = 1): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			const activeFilters = Object.fromEntries(
				Object.entries(this.filters).filter(
					([, value]) => value !== null && value !== "",
				),
			);

			if (activeFilters.date) {
				activeFilters.start_date = activeFilters.date;
				delete activeFilters.date;
			}

			await useFetch(this.pathUrl, {
				method: "GET",
				params: { page, ...activeFilters, "with[]": ["user", "animal"] },
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.list = (this.pagination?.data as IRegistration[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar os registros.";
				},
			});
		},

		// 🔹 Nova função para buscar tutores
		async fetchTutors(): Promise<void> {
			if (this.isLoading) return;

			this.isLoading = true;
			this.errorMessage = "";

			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					page: 1,
					"with[]": ["user"], // só precisamos do user
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					const registrations = (result.data as IPagination)?.data || [];

					const uniqueTutors = registrations
						.map((item: any) => item.user)
						.filter(Boolean)
						.map((user: any) => ({
							id: String(user.id),
							text: user.name,
						}))
						.filter(
							(value: IOption, index: number, self: IOption[]) =>
								index === self.findIndex((t) => t.id === value.id),
						);

					this.tutors = uniqueTutors;
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage =
						response._data?.message || "Erro ao buscar tutores.";
				},
			});
		},

		async downloadTerm(id: string | number | undefined): Promise<void> {
			if (this.isDownloading || !id) return;

			this.isDownloading = true;
			this.errorDownloadingMessage = "";

			await useFetch(`${this.pathUrl}/${id}/term`, {
				method: "GET",
				responseType: "blob",
				onResponse: ({ response }) => {
					const blob = new Blob([response._data], { type: "application/pdf" });
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", `term_${id}.pdf`);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
					this.isDownloading = false;
				},
				onResponseError: ({ response }) => {
					this.isDownloading = false;
					this.errorDownloadingMessage =
						response._data?.message || "Erro ao baixar o termo.";
				},
			});
		},

		changePage(page: number) {
			this.pagination.current_page = page;
			this.fetchList(page);
		},
		clearFilters() {
			this.filters.start_date = null;
			this.filters.species = "";
			this.filters.status = "";
			this.filters.tutor = "";
			this.fetchList(1);
		},
	},
});
