import { useForm } from "~/composables/useForm";

export const useAnimalsCreate = defineStore("animals-create", {
  state: () => {
    const animal = ref({} as IAnimal);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const form = useForm(['name', 'species', 'weight', 'birthDate']);

    return {
      animal,
      isLoading,
      errorMessage,
      successMessage,
      form,
    };
  },
  actions: {
    async createAnimal(): Promise<void> {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      await useFetch("/api/animals/store", {
        method: "POST",
        body: this.animal,
        onResponse: ({response}) => {
          this.successMessage = "Animal criado com sucesso!";
          const result = response._data as IResponse;
          this.animal = result.data || {} as IAnimal;
          this.isLoading = false;
        },
        onResponseError: ({response}) => {
          if (response.status === 422) {
            this.errorMessage = response._data.message || "Erro de validação.";
            this.isLoading = false;

            return;
          }

          this.errorMessage = response._data.message || "Erro ao criar animal.";
          this.isLoading = false;
        },
      });
    },
  },
});