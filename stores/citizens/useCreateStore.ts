import { useForm } from "~/composables/useForm";

export const useCreateStore = defineStore("citizens-create", {
  state: () => {
    const citizens = ref({} as ICitizens);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    const form = useForm([
      "image",
      "name",
      "document",
      "password",
      "password_confirmation",
      "email",
      "gender",
      "birth_date",
      "telephone",
      "street",
      "number",
      "zip_code",
      "district",
      "complement",
      "city",
      "state",
      "status",
      "can_report_abuse",
      "can_mobile_castration"
    ]);

    return { citizens, isLoading, errorMessage, successMessage, form };
  },
  actions: {
    setFormField(field: string, value: any) {
      this.form[field].value = value;
      this.setFormError(field, []);
    },
    setFormError(field: string, errorMessages: string[]) {
      this.form[field].errorMessages = errorMessages;
    },
    getFormData(): FormData {
      const formData = new FormData();

      const addressFields = [
        "zip_code",
        "street",
        "number",
        "complement",
        "district",
        "city",
        "state",
      ];

      const addressObj: Record<string, any> = {};
      for (const key of addressFields) {
        const value = this.form[key]?.value;
        if (value !== null && value !== undefined && value !== "") {
        addressObj[key] = typeof value === "object" && "id" in value ? value.id : value;
        }
      }

      formData.append("address", JSON.stringify([addressObj]));

      for (const key in this.form) {
        if (!Object.prototype.hasOwnProperty.call(this.form, key)) continue;
        if (addressFields.includes(key)) continue; // já foi adicionado no endereço

        const value = this.form[key]?.value;
        if (value === null || value === undefined || value === "") continue;

        formData.append(
        key,
        typeof value === "object" && "id" in value ? String(value.id) : String(value)
        );
      }

      formData.append("special_permissions", "0");

      return formData;
	  },
    handleResponseError(response: IResponse) {
      if (response.type !== "error") return;

      this.errorMessage = response.message || "Erro ao processar a solicitação.";

      if (response.status === 401) {
        this.errorMessage = response.message || "Não autorizado. Faça login novamente.";
      }

      if (response.status === 422) {
        for (const field in response.errors) {
          if (Object.prototype.hasOwnProperty.call(response.errors, field)) {
            this.setFormError(field, response.errors[field]);
          }
        }
      }

      this.isLoading = false;
    },
    async create(): Promise<void> {
      if (this.isLoading) return;

      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const formData = this.getFormData();

      await useFetch("/api/citizens/store", {
        method: "POST",
        body: formData,
        onResponse: ({ response }) => {
          const responseData = response._data || ({} as IResponse);

          if (responseData.type === "error") return this.handleResponseError(responseData);

          this.successMessage = responseData.message || "Criado com sucesso!";
          this.citizens = responseData.data || ({} as ICitizens);
          this.isLoading = false;

          const router = useRouter();
          router.push({ name: "citizens-list" });
        },
      });
    },
    resetForm() {
      for (const key in this.form) {
        if (Object.prototype.hasOwnProperty.call(this.form, key)) {
          this.form[key].value = null;
          this.form[key].errorMessages = [];
        }
      }
      this.errorMessage = "";
      this.successMessage = "";
      this.citizens = {} as ICitizens;
    },
  },
});
