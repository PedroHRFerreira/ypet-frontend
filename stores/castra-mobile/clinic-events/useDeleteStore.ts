import { defineStore } from "pinia";

export const useDeleteStore = defineStore("clinic-events-delete", {
	state: () => ({
		isLoading: false as boolean,
		errorMessage: "" as string,
		successMessage: "" as string,
		pathUrl: "/api/clinic-events" as string,
	}),
	actions: {
		async destroy(id: string | number | undefined): Promise<void> {
			if (this.isLoading || !id) return;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";

			await useFetch(`${this.pathUrl}/${id}`, {
				method: "DELETE",
				onResponse: ({ response }) => {
					const result: IResponse = response._data as IResponse;
					if (result?.type === "success") {
						this.successMessage = result?.message || "Excluído com sucesso";
					} else {
						this.errorMessage = result?.message || "Erro ao excluir.";
					}
					this.isLoading = false;
				},
				onResponseError: ({ response }) => {
					this.isLoading = false;
					this.errorMessage = response._data?.message || "Erro ao excluir.";
				},
			});
		},
	},
});
