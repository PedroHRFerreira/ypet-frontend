export const useGenderEnum = defineStore("gender-enum", {
  state: () => {
    const genderEnum = ref([] as IEnum[]);
    const isLoading = ref(false);
    const errorMessage = ref("");

    return {
      genderEnum,
      isLoading,
      errorMessage,
    };
  },
  actions: {
    async fetchGenderEnum(): Promise<void> {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      await useFetch("/api/enums/gender", {
        method: "GET",
        onResponse: ({ response }) => {
          const result: IResponse = response._data as IResponse;
          this.genderEnum = result.data || [];
          this.isLoading = false;
        },
        onResponseError: ({ response }) => {
          this.isLoading = false;
          this.errorMessage = response._data?.message || "Erro ao buscar enum de gêneros.";
        },
      });
    },
    async getOptions(): Promise<IOption[]> {
      if (this.genderEnum.length === 0) {
        await this.fetchGenderEnum();
      }

      const options = this.genderEnum.map((item) => ({
        id: item.value,
        text: item.label,
      }));

      return options || [] as IOption[];
    },
  },
});