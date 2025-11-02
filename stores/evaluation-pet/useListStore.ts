import type { IPagination } from "~/types/global";

export const useListStore = defineStore("evaluation-pet-list", {
  state: () => {
    const evaluationPet = ref([] as IEvaluationPet[]);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const pagination = ref<IPagination>({} as IPagination);
    const filters = {
      status: null as string | null,
      animal_name: null as string | null,
    };

    return {
      filters,
      evaluationPet,
      isLoading,
      errorMessage,
      pagination,
    };
  },
  actions: {
    async fetchList(params = {}): Promise<void> {
      if (this.isLoading) {
        return;
      }

      const activeFilters = Object.fromEntries(
        Object.entries(this.filters).filter(([_, value]) => value !== null),
      );

      this.isLoading = true;
      this.errorMessage = "";

      await useFetch("/api/evaluation-pet", {
        method: "GET",
        params: {
          ...params,
          ...activeFilters,
          "with[]": ["tutor", "animal"],
        },
        onResponse: ({ response }) => {
          const result: IResponse = response._data as IResponse;

          this.pagination = (result.data as IPagination) || ({} as IPagination);
          this.evaluationPet =
            (this.pagination?.data as IEvaluationPet[]) || [];
          this.isLoading = false;
        },
        onResponseError: ({ response }) => {
          this.isLoading = false;
          this.errorMessage = response._data?.message || "Erro ao buscar.";
        },
      });
    },
  },
});
