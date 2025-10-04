import { useForm } from "~/composables/useForm";

export const usePreSurgeryAssessmentStore = defineStore(
	"pre-surgery-assessment",
	{
		state: () => {
			const isLoading = ref(false);
			const isLoadingAnimal = ref(false);
			const errorMessage = ref("");
			const successMessage = ref("");
			const animalData = ref<any>(null);

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
			// Dados do animal para exibição (apenas leitura)
			animalDisplayData: (state) => ({
				name: state.animalData?.name || "",
				species: state.animalData?.species?.name || "",
				breed: state.animalData?.breed || "",
				age: state.animalData?.birth_date || "",
				gender: state.animalData?.gender?.name || "",
				weight: state.animalData?.weight ? String(state.animalData.weight) : "",
			}),
			// Payload formatado para envio à API
			apiPayload: (state) => ({
				animal_id: Number(state.form.animal_id.value),
				mucosa: state.form.mucosa.value || "",
				hydration: state.form.hydration.value || "",
				adequate_fasting: Boolean(state.form.adequate_fasting.value),
				fasting_time:
					state.form.fasting_time.value !== null &&
					state.form.fasting_time.value !== ""
						? Number(state.form.fasting_time.value)
						: null,
				escore_corporal:
					state.form.escore_corporal.value !== null &&
					state.form.escore_corporal.value !== ""
						? Number(state.form.escore_corporal.value)
						: null,
				heart_rate:
					state.form.heart_rate.value !== null &&
					state.form.heart_rate.value !== ""
						? Number(state.form.heart_rate.value)
						: null,
				respiratory_rate:
					state.form.respiratory_rate.value !== null &&
					state.form.respiratory_rate.value !== ""
						? Number(state.form.respiratory_rate.value)
						: null,
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
			}),
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
				if (response.type !== "error") {
					return;
				}

				this.errorMessage =
					response.message || "Erro ao processar a solicitação.";

				if (response.status === 401) {
					this.errorMessage =
						response.message ||
						"Não autorizado. Por favor, faça login novamente.";
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
								// Definir o animal_id no formulário
								this.setFormField("animal_id", Number(animalId));
							}

							this.isLoadingAnimal = false;
						},
					});
				} catch (error) {
					console.log(error);
					this.errorMessage = "Erro ao buscar dados do animal.";
					this.isLoadingAnimal = false;
				}
			},
			async store(): Promise<void> {
				if (this.isLoading) {
					return;
				}

				// Validar formulário antes de enviar
				if (!this.validateForm()) {
					return;
				}

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
			resetForm() {
				for (const key in this.form) {
					if (Object.prototype.hasOwnProperty.call(this.form, key)) {
						this.form[key].value = null;
						this.form[key].errorMessages = [];
					}
				}

				// Campos booleanos resetados para null (usuário deve definir)

				this.errorMessage = "";
				this.successMessage = "";
				this.animalData = null;
			},
			validateForm(): boolean {
				return (
					this.checkMucosa() &&
					this.checkHydration() &&
					this.checkAdequateFasting() &&
					this.checkEscoreCorporal() &&
					this.checkAbdominalPalpation() &&
					this.checkPalpationOfLymphNodes() &&
					this.checkVulvarDischarge() &&
					this.checkForeskinDischarge() &&
					this.checkEctopicTesticle()
				);
			},
			checkMucosa(): boolean {
				const mucosa = this.form.mucosa.value;
				this.setFormError("mucosa", []);

				if (!mucosa || mucosa === "") {
					this.setFormError("mucosa", ["Mucosa é obrigatória"]);
					return false;
				}

				return true;
			},
			checkHydration(): boolean {
				const hydration = this.form.hydration.value;
				this.setFormError("hydration", []);

				if (!hydration || hydration === "") {
					this.setFormError("hydration", ["Hidratação é obrigatória"]);
					return false;
				}

				return true;
			},
			checkAdequateFasting(): boolean {
				const adequateFasting = this.form.adequate_fasting.value;
				this.setFormError("adequate_fasting", []);

				if (adequateFasting === null || adequateFasting === undefined) {
					this.setFormError("adequate_fasting", [
						"Jejum adequado é obrigatório",
					]);
					return false;
				}

				return true;
			},
			checkEscoreCorporal(): boolean {
				const escoreCorporal = this.form.escore_corporal.value;
				this.setFormError("escore_corporal", []);

				if (!escoreCorporal || escoreCorporal === "") {
					this.setFormError("escore_corporal", [
						"Escore corporal é obrigatório",
					]);
					return false;
				}

				const score = Number(escoreCorporal);
				if (isNaN(score) || score < 1 || score > 5) {
					this.setFormError("escore_corporal", [
						"Escore corporal deve ser entre 1 e 5",
					]);
					return false;
				}

				return true;
			},
			checkAbdominalPalpation(): boolean {
				const abdominalPalpation = this.form.abdominal_palpation.value;
				this.setFormError("abdominal_palpation", []);

				if (!abdominalPalpation || abdominalPalpation === "") {
					this.setFormError("abdominal_palpation", [
						"Palpação abdominal é obrigatória",
					]);
					return false;
				}

				return true;
			},
			checkPalpationOfLymphNodes(): boolean {
				const palpationOfLymphNodes = this.form.palpation_of_lymph_nodes.value;
				this.setFormError("palpation_of_lymph_nodes", []);

				if (!palpationOfLymphNodes || palpationOfLymphNodes === "") {
					this.setFormError("palpation_of_lymph_nodes", [
						"Palpação de linfonodos é obrigatória",
					]);
					return false;
				}

				return true;
			},
			checkVulvarDischarge(): boolean {
				const vulvarDischarge = this.form.vulvar_discharge.value;
				this.setFormError("vulvar_discharge", []);

				if (vulvarDischarge === null || vulvarDischarge === undefined) {
					this.setFormError("vulvar_discharge", [
						"Secreção vulvar é obrigatória",
					]);
					return false;
				}

				return true;
			},
			checkForeskinDischarge(): boolean {
				const foreskinDischarge = this.form.foreskin_discharge.value;
				this.setFormError("foreskin_discharge", []);

				if (foreskinDischarge === null || foreskinDischarge === undefined) {
					this.setFormError("foreskin_discharge", [
						"Secreção prepucial é obrigatória",
					]);
					return false;
				}

				return true;
			},
			checkEctopicTesticle(): boolean {
				const ectopicTesticle = this.form.ectopic_testicle.value;
				this.setFormError("ectopic_testicle", []);

				if (ectopicTesticle === null || ectopicTesticle === undefined) {
					this.setFormError("ectopic_testicle", [
						"Testículo ectópico é obrigatório",
					]);
					return false;
				}

				return true;
			},
		},
	},
);
