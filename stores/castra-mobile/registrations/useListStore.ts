import type { IPagination } from "~/types/global";

export const useListStore = defineStore("list-registrations", {
	state: () => {
		const list = ref([] as IRegistration[]);
		const isLoading = ref(false);
    const isDownloading = ref(false);
    const errorDownloadingMessage = ref("");
		const errorMessage = ref("");
		const pagination = ref<IPagination>({} as IPagination);
		const pathUrl = "/api/registrations";

		return {
			list,
			isLoading,
      isDownloading,
			errorMessage,
      errorDownloadingMessage,
			pagination,
			pathUrl,
		};
	},
	actions: {
		async fetchList(params = {}): Promise<void> {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;
			this.errorMessage = "";
			await useFetch(this.pathUrl, {
				method: "GET",
				params: {
					...params,
				},
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;

					this.pagination = (result.data as IPagination) || ({} as IPagination);
					this.list = (this.pagination?.data as IRegistration[]) || [];
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message;
				},
			});
		},
    async downloadTerm(id: string | number | undefined): Promise<void> {
      if (this.isDownloading || !id) {
        return;
      }

      this.isDownloading = true;
      this.errorDownloadingMessage = "";
      await useFetch(`${this.pathUrl}/${id}/term`, {
        method: "GET",
        responseType: 'blob',
        onResponse: ({ response }) => {

          const blob = new Blob([response._data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `term_${id}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.isDownloading = false;
        },
        onResponseError: ({ response }) => {
          this.isDownloading = false;
          this.errorDownloadingMessage = response._data?.message;
        },
      });
    },
	},
});
