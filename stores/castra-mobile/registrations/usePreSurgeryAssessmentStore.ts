import { useForm } from "~/composables/useForm";

interface AnimalData {
	name?: string;
	species?: { name: string };
	breed?: string;
	birth_date?: string;
	gender?: { name: string };
	weight?: number;
}

interface ValidationRule {
	field: string;
	message: string;
	validator?: (value: any) => string | null;
}

export const usePreSurgeryAssessmentStore = defineStore(
	"pre-surgery-assessment",
	{
		state: () => {
			const isLoading = ref(false);
			const isLoadingAnimal = ref(false);
			const errorMessage = ref("");
			const successMessage = ref("");
			const animalData = ref<AnimalData | null>(null);

			const form = useForm([
				"animal_id",
				"mucosa",
				"hydration",
				"adequate_fasting",
				"fasting_time",
				"escore_corporal",
				"heart_rate",
				"respiratory_rate",
				"abdominal_palpation",
				"abdominal_palpation_description",
				"palpation_of_lymph_nodes",
				"palpation_of_lymph_nodes_description",
				"vulvar_discharge",
				"foreskin_discharge",
				"ectopic_testicle",
				"obervations",
				"transsurgical_intercurrences",
				"measures_taken",
				"animal_data",
			]);

			form.adequate_fasting.value = false;
			form.vulvar_discharge.value = false;
			form.foreskin_discharge.value = false;
			form.ectopic_testicle.value = false;

			return {
				isLoading,
				isLoadingAnimal,
				errorMessage,
				successMessage,
				animalData,
				form,
			};
		},
		getters: {
			animalDisplayData: (state) => ({
				name: state.animalData?.name || "",
				species: state.animalData?.species?.name || "",
				breed: state.animalData?.breed || "",
				age: state.animalData?.birth_date || "",
				gender: state.animalData?.gender?.name || "",
				weight: state.animalData?.weight ? String(state.animalData.weight) : "",
			}),
			apiPayload: (state) => {
				const toNumber = (value: any): number | null => {
					if (value === null || value === "") return null;
					return Number(value);
				};

				return {
					animal_id: Number(state.form.animal_id.value),
					mucosa: state.form.mucosa.value || "",
					hydration: state.form.hydration.value || "",
					adequate_fasting: Boolean(state.form.adequate_fasting.value),
					fasting_time: toNumber(state.form.fasting_time.value),
					escore_corporal: toNumber(state.form.escore_corporal.value),
					heart_rate: toNumber(state.form.heart_rate.value),
					respiratory_rate: toNumber(state.form.respiratory_rate.value),
					abdominal_palpation: state.form.abdominal_palpation.value || "",
					abdominal_palpation_description:
						state.form.abdominal_palpation_description.value || null,
					palpation_of_lymph_nodes:
						state.form.palpation_of_lymph_nodes.value || "",
					palpation_of_lymph_nodes_description:
						state.form.palpation_of_lymph_nodes_description.value || null,
					vulvar_discharge: Boolean(state.form.vulvar_discharge.value),
					foreskin_discharge: Boolean(state.form.foreskin_discharge.value),
					ectopic_testicle: Boolean(state.form.ectopic_testicle.value),
					obervations: state.form.obervations.value || null,
					transsurgical_intercurrences:
						state.form.transsurgical_intercurrences.value || null,
					measures_taken: state.form.measures_taken.value || null,
					animal_data: state.form.animal_data.value || null,
				};
			},
		},
		actions: {
			setFormField(field: string, value: any): void {
				this.form[field].value = value;
				this.setFormError(field, []);
			},

			setFormError(field: string, errorMessages: string[]): void {
				this.form[field].errorMessages = errorMessages;
			},

			handleResponseError(response: IResponse): void {
				if (response.type !== "error") return;

				const errorMessages: Record<number, string> = {
					401: "Não autorizado. Por favor, faça login novamente.",
				};

				this.errorMessage =
					errorMessages[response.status] ||
					response.message ||
					"Erro ao processar a solicitação.";

				if (response.status === 422 && response.errors) {
					Object.entries(response.errors).forEach(([field, errors]) => {
						this.setFormError(field, errors);
					});
				}

				this.isLoading = false;
			},

			async fetchAnimalData(animalId: string | string[]): Promise<void> {
				if (!animalId || this.isLoadingAnimal) return;

				try {
					this.isLoadingAnimal = true;
					this.errorMessage = "";

					await useFetch(`/api/animals/${animalId}`, {
						method: "GET",
						onResponse: ({ response }) => {
							const responseData = response._data || ({} as IResponse);

							if (responseData.type === "error") {
								return this.handleResponseError(responseData);
							}

							if (responseData.data) {
								this.animalData = responseData.data;
								this.setFormField("animal_id", Number(animalId));
							}

							this.isLoadingAnimal = false;
						},
					});
				} catch (error) {
					console.error("Erro ao buscar dados do animal:", error);
					this.errorMessage = "Erro ao buscar dados do animal.";
					this.isLoadingAnimal = false;
				}
			},

			async store(): Promise<void> {
				if (this.isLoading || !this.validateForm()) return;

				this.isLoading = true;
				this.errorMessage = "";
				this.successMessage = "";

				const payload = this.apiPayload;

				await useFetch("/api/pre-surgery-assessments/store", {
					method: "POST",
					body: payload,
					onResponse: ({ response }) => {
						const responseData = response._data || ({} as IResponse);

						if (responseData.type === "error") {
							return this.handleResponseError(responseData);
						}

						this.successMessage =
							responseData.message || "Triagem salva com sucesso!";
						this.isLoading = false;
					},
				});
			},

			resetForm(): void {
				Object.keys(this.form).forEach((key) => {
					this.form[key].value = null;
					this.form[key].errorMessages = [];
				});

				this.form.adequate_fasting.value = false;
				this.form.vulvar_discharge.value = false;
				this.form.foreskin_discharge.value = false;
				this.form.ectopic_testicle.value = false;

				this.errorMessage = "";
				this.successMessage = "";
				this.animalData = null;
			},

			validateRequiredField(
				field: string,
				errorMessage: string,
				validator?: (value: any) => string | null,
			): boolean {
				const value = this.form[field].value;
				this.setFormError(field, []);

				if (value === null || value === undefined || value === "") {
					this.setFormError(field, [errorMessage]);
					return false;
				}

				if (validator) {
					const validationError = validator(value);
					if (validationError) {
						this.setFormError(field, [validationError]);
						return false;
					}
				}

				return true;
			},

			validateForm(): boolean {
				const validations: ValidationRule[] = [
					{ field: "mucosa", message: "Mucosa é obrigatória" },
					{ field: "hydration", message: "Hidratação é obrigatória" },
					{
						field: "adequate_fasting",
						message: "Jejum adequado é obrigatório",
					},
					{
						field: "escore_corporal",
						message: "Escore corporal é obrigatório",
						validator: (value: any) => {
							const score = Number(value);
							if (isNaN(score) || score < 1 || score > 5) {
								return "Escore corporal deve ser entre 1 e 5";
							}
							return null;
						},
					},
					{
						field: "abdominal_palpation",
						message: "Palpação abdominal é obrigatória",
					},
					{
						field: "palpation_of_lymph_nodes",
						message: "Palpação de linfonodos é obrigatória",
					},
					{
						field: "vulvar_discharge",
						message: "Secreção vulvar é obrigatória",
					},
					{
						field: "foreskin_discharge",
						message: "Secreção prepucial é obrigatória",
					},
					{
						field: "ectopic_testicle",
						message: "Testículo ectópico é obrigatório",
					},
				];

				return validations.every((validation) =>
					this.validateRequiredField(
						validation.field,
						validation.message,
						validation.validator,
					),
				);
			},
		},
	},
);
