export const useAnimalsList = defineStore("animals-list", {
  state: () => {
    const animals = ref([] as IAnimal[]);
    const isLoading = ref(false);
    const errorMessage = ref("");

    return {
      animals,
      isLoading,
      errorMessage,
    };
  },
  actions: {
    async fetchAnimals(params = {}): Promise<void> {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      await useFetch("/api/animals", {
        method: "GET",
        params: {
          ...params,
          'with[]': 'status',
        },
        onResponse: ({ request, response, options })=>  {
          const result: IResponse = response._data as IResponse;

          this.animals = result.data || [];
          this.isLoading = false;
        },
        onResponseError: ({ response }) => {
          this.isLoading = false;
          this.errorMessage = response._data?.message || "Erro ao buscar animais.";
        },
      })
    },
  },
});