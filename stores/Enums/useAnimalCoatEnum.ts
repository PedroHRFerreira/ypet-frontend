export const useAnimalCoatEnum = defineStore("animal-coat-enum", {
  state: () => {
    const animalCoatEnum = ref([] as IEnum[]);
    const isLoading = ref(false);
    const errorMessage = ref("");

    return {
      animalCoatEnum,
      isLoading,
      errorMessage,
    };
  },
  actions: {
    async fetchAnimalCoatEnum(): Promise<void> {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      await useFetch("/api/enums/animal-coat", {
        method: "GET",
        onResponse: ({ request, response, options }) => {
          const result: IResponse = response._data as IResponse;

          this.animalCoatEnum = result.data || [];
          this.isLoading = false;
        },
        onResponseError: ({ response }) => {
          this.isLoading = false;
          this.errorMessage = response._data?.message || "Erro ao buscar enum de status de animais.";
        },
      });
    },
    async getOptions(): Promise<IOption[]> {
      if (this.animalCoatEnum.length === 0) {
        await this.fetchAnimalCoatEnum();
      }

      const options = this.animalCoatEnum.map((item) => ({
        id: item.value,
        text: item.label,
      }));

      return options || [] as IOption[];
    },
  },
});