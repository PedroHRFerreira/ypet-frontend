<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useZipcodeLookup } from "~/composables/useZipcodeLookup";
import { useMaskZipCode } from "~/composables/useMaskZipCode";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useCreateStore } from "~/stores/castra-mobile/registrations/useCreateStore";
import { useAnimalSizeEnumStore } from "~/stores/Enums/useAnimalSizeEnumStore";
import { useAnimalStatusEnumStore } from "~/stores/Enums/useAnimalStatusEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useListStore } from "~/stores/castra-mobile/clinic-events/useListStore";

export default defineComponent({
	name: "OrganismsCastraMobileRegistrationsCreate",
	setup() {
		const createStore = useCreateStore();
		const { form } = createStore;

		const optionsSpecies = ref<IOption[]>([]);
		const optionsGender = ref<IOption[]>([]);
		const optionsSize = ref<IOption[]>([]);
		const optionsUF = ref<IOption[]>([]);
		const { fetchAddress } = useZipcodeLookup();

		onMounted(async () => {
			[
				optionsSpecies.value,
				optionsGender.value,
				optionsSize.value,
				optionsUF.value,
			] = await Promise.all([
				useAnimalSpeciesEnumStore().getOptions(),
				useGenderEnumStore().getOptions(),
				useAnimalSizeEnumStore().getOptions(),
				useUFEnumStore().getOptions(),
			]);
			await useListStore().fetchListWithoutPagination();
		});

		const optionsClinicEvents = computed(() => {
			return useListStore().list.map((event) => {
				const startDate = useDayjs(event.start_date).format("DD/MM/YYYY");
				const endDate = useDayjs(event.end_date).format("DD/MM/YYYY");

				return {
					text: `${event.name} - ${startDate} às ${endDate}`,
					id: event.id,
					data: event,
				};
			});
		});

		const optionsSchedulerAt = ref([] as Array<IOption>);

		const schedulerAt = ref("");
		const tutorEmail = ref("");

		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const showError = computed(() => createStore.showErrorModal);
		const errorMessage = computed(() => createStore.errorMessage);

		const modalFeedback = ref({
			confirm: {
				title: "Deseja criar novo registro?",
				description: "Após confirmação, você irá visualizá-lo no painel",
				confirmText: "Confirmar",
				cancelText: "Cancelar",
				action: async () => {
					if (createStore.isLoading) {
						return;
					}

					await createStore.store();

					if (createStore.successMessage) {
						showSuccess.value = true;

						const router = useRouter();
						router.back();

						return;
					}

					showConfirm.value = false;
				},
			},
			success: {
				show: false,
				title: "Criado com sucesso!",
				description: "Visualize os dados na área de listagem.",
				continueText: "Continuar",
				action: () => {
					showSuccess.value = false;
					createStore.resetForm();
				},
			},
			error: {
				show: false,
				title: "Erro ao criar registro",
				description: errorMessage.value,
				continueText: "Fechar",
				action: () => {
					createStore.showErrorModal = false;
				},
			},
		});

		const header = {
			session_primary: {
				title: {
					label: "Sobre o agendamento",
					type: "text-p2",
					weight: "medium",
					color: "var(--brand-color-dark-blue-900)",
				},
			},
			session_secondary: {
				title: {
					label: "Sobre o tutor",
					type: "text-p2",
					weight: "regular",
					color: "var(--brand-color-dark-blue-900)",
				},
			},
			session_tertiary: {
				title: {
					label: "Sobre o pet",
					type: "text-p2",
					weight: "regular",
					color: "var(--brand-color-dark-blue-900)",
				},
			},
		};

		const footer = {
			buttons: [
				{
					text: "Voltar",
					type: "secondary",
					icon: "arrow-left",
					iconLeft: true,
					nameIconLeft: "arrow-left",
					iconRight: false,
					nameIconRight: "",
					size: "medium",
					width: "auto",
					action: () => {
						const router = useRouter();
						router.back();
					},
				},
				{
					text: "Cadastrar",
					type: "primary",
					icon: "plus",
					iconLeft: true,
					nameIconLeft: "plus",
					iconRight: false,
					nameIconRight: "",
					size: "medium",
					width: "auto",
					action: () => {
						showConfirm.value = true;
					},
				},
			],
		};

		const birthDate = ref("");

		async function onInputTutorZipCode(value: string) {
			const masked = useMaskZipCode(value);
			// show masked in UI by setting the masked into component binding via computed value; store only digits
			const digits = value.replace(/\D/g, "");
			createStore.setFormField("tutor_address_zip_code", digits);
			if (digits.length === 8) {
				const data = await fetchAddress(digits);
				if (data) {
					createStore.setFormField("tutor_address_street", data.street);
					createStore.setFormField("tutor_address_district", data.district);
					createStore.setFormField("tutor_address_city", data.city);
					const ufOpt = optionsUF.value.find(
						(o) => (o as any).id === data.state || (o as any).text === data.state,
					);
					if (ufOpt) {
						createStore.setFormField("tutor_address_state", (ufOpt as any).id);
					}
				}
			}
		}

		return {
			useDayjs,
			optionsGender,
			optionsSpecies,
			optionsSize,
			optionsUF,
			optionsClinicEvents,
			optionsSchedulerAt,
			schedulerAt,
			form,
			createStore,
			header,
			footer,
			modalFeedback,
			showConfirm,
			showSuccess,
			showError,
			errorMessage,
			birthDate,
			tutorEmail,
			onInputTutorZipCode,
		};
	},
	watch: {
		birthDate: {
			handler(newValue) {
				this.createStore.setFormField("animal_birth_date", newValue);
			},
			deep: true,
		},
		schedulerAt: {
			handler(newValue) {
				if (newValue && typeof newValue === "object" && newValue.id) {
					this.createStore.setFormField("scheduler_at", newValue.id);
				}
			},
			deep: true,
		},
		tutorEmail: {
			handler(newValue) {
				this.createStore.setFormField("tutor_email", newValue);
			},
			deep: true,
		},
		"form.mobile_clinic_event_id": {
			handler(newValue) {
				this.optionsSchedulerAt = [];
				if (
					newValue &&
					typeof newValue.value === "object" &&
					"data" in newValue.value
				) {
					const eventData = (newValue.value as any).data;

					if (eventData && eventData.start_date && eventData.end_date) {
						const startDate = this.useDayjs(eventData.start_date);
						const endDate = this.useDayjs(eventData.end_date);
						const quantityDays = Math.abs(endDate.diff(startDate, "day"));

						for (let i = 0; i <= quantityDays; i++) {
							this.optionsSchedulerAt.push({
								id: startDate.add(i, "day").format("YYYY-MM-DD"),
								text: startDate.add(i, "day").format("DD/MM/YYYY"),
							} as IOption);
						}
					}
				}
			},
			deep: true,
		},
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-if="modalFeedback"
		key="confirmCreateClinicEvent"
		v-model:open="showConfirm"
		variant="confirm"
		:title="modalFeedback.confirm.title"
		:description="modalFeedback.confirm.description"
		:confirm-text="modalFeedback.confirm.confirmText"
		:cancel-text="modalFeedback.confirm.cancelText"
		@confirm="modalFeedback.confirm.action()"
	/>
	<MoleculesConfirmFeedbackModal
		v-if="modalFeedback"
		key="successCreateClinicEvent"
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
	/>
	<MoleculesConfirmFeedbackModal
		v-if="modalFeedback"
		key="errorCreateRegistration"
		:open="showError"
		@update:open="(value) => (createStore.showErrorModal = value)"
		variant="confirm"
		:title="modalFeedback.error.title"
		:description="modalFeedback.error.description"
		:confirm-text="modalFeedback.error.continueText"
		@confirm="modalFeedback.error.action()"
	/>
	<div class="settings-create">
		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.session_primary.title.type"
					:text="header.session_primary.title.label"
					:weight="header.session_primary.title.weight"
					:color="header.session_primary.title.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="70%"
						label="Evento de castração"
						:options="optionsClinicEvents"
						:message-error="
							form.mobile_clinic_event_id.errorMessages.join(', ')
						"
						@item-selected="
							createStore.setFormField('mobile_clinic_event_id', $event)
						"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="Data de agendamento"
						:options="optionsSchedulerAt"
						:value="schedulerAt"
						:message-error="form.scheduler_at.errorMessages.join(', ')"
						@item-selected="schedulerAt = $event"
					/>
				</div>
			</div>
		</section>

		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.session_secondary.title.type"
					:text="header.session_secondary.title.label"
					:weight="header.session_secondary.title.weight"
					:color="header.session_secondary.title.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Email"
						max-width="25%"
						:value="tutorEmail"
						:message-error="form.tutor_email.errorMessages.join(', ')"
						@on-input="tutorEmail = $event"
					/>
					<MoleculesInputCommon
						label="Nome completo"
						max-width="25%"
						:value="form.tutor_name.value as string"
						:message-error="form.tutor_name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_name', $event)"
					/>
					<MoleculesInputCommon
						label="CPF"
						max-width="25%"
						:value="form.tutor_document.value as string"
						:message-error="form.tutor_document.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_document', $event)"
					/>
					<MoleculesInputCommon
						label="Telefone/Celular"
						max-width="25%"
						:value="form.tutor_cellphone.value as string"
						:message-error="form.tutor_cellphone.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_cellphone', $event)"
					/>
				</div>

				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="CEP"
						max-width="25%"
						:value="useMaskZipCode(String(form.tutor_address_zip_code.value || ''))"
						:message-error="
							form.tutor_address_zip_code.errorMessages.join(', ')
						"
						@on-input="onInputTutorZipCode"
					/>
					<MoleculesInputCommon
						label="Endereço"
						max-width="40%"
						:value="form.tutor_address_street.value as string"
						:message-error="form.tutor_address_street.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_address_street', $event)"
					/>
					<MoleculesInputCommon
						label="Numero"
						max-width="10%"
						:value="form.tutor_address_number.value as string"
						:message-error="form.tutor_address_number.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_address_number', $event)"
					/>
					<MoleculesInputCommon
						label="Bairro"
						max-width="25%"
						:value="form.tutor_address_district.value as string"
						:message-error="
							form.tutor_address_district.errorMessages.join(', ')
						"
						@on-input="
							createStore.setFormField('tutor_address_district', $event)
						"
					/>
				</div>

				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Cidade"
						max-width="25%"
						:value="form.tutor_address_city.value as string"
						:message-error="form.tutor_address_city.errorMessages.join(', ')"
						@on-input="createStore.setFormField('tutor_address_city', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Estado"
						:options="optionsUF"
						:message-error="form.tutor_address_state.errorMessages.join(', ')"
						@item-selected="
							createStore.setFormField('tutor_address_state', $event)
						"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="50%"
						:value="form.tutor_address_complement.value as string"
						:message-error="
							form.tutor_address_complement.errorMessages.join(', ')
						"
						@on-input="
							createStore.setFormField('tutor_address_complement', $event)
						"
					/>
				</div>
			</div>
		</section>

		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.session_tertiary.title.type"
					:text="header.session_tertiary.title.label"
					:weight="header.session_tertiary.title.weight"
					:color="header.session_tertiary.title.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome do animal"
						max-width="40%"
						:value="form.animal_name.value as string"
						:message-error="form.animal_name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('animal_name', $event)"
					/>
					<MoleculesInputDate
						v-model="birthDate"
						label="Data de nascimento"
						name="birth_date"
						placeholder="YYYY-MM-DD"
						min="1900-01-01"
						max="2025-12-31"
						width="30%"
						:required="true"
						:error-messages="form.animal_birth_date.errorMessages"
					/>
					<MoleculesInputCommon
						label="Cor"
						type-input="text"
						max-width="15%"
						:value="form.animal_color.value as string"
						:message-error="form.animal_color.errorMessages.join(', ')"
						@on-input="createStore.setFormField('animal_color', $event)"
					/>
					<MoleculesInputCommon
						label="Peso (kg)"
						type-input="text"
						max-width="15%"
						:value="form.animal_weight.value as string"
						:message-error="form.animal_weight.errorMessages.join(', ')"
						@on-input="createStore.setFormField('animal_weight', $event)"
					/>
				</div>

				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="25%"
						label="Tipo de Pet"
						:options="optionsSpecies"
						:message-error="form.animal_specie.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('animal_specie', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Sexo do animal"
						:options="optionsGender"
						:message-error="form.animal_gender.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('animal_gender', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Porte do animal"
						:options="optionsSize"
						:message-error="form.animal_size.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('animal_size', $event)"
					/>
				</div>
			</div>
		</section>

		<div class="settings-create__about-pet__content--footer">
			<MoleculesButtonsCommon
				v-for="button in footer.buttons"
				:key="button.text"
				:type="button.type"
				:text="button.text"
				:icon-left="button.iconLeft"
				:icon-right="button.iconRight"
				:name-icon-left="button.nameIconLeft"
				:name-icon-right="button.nameIconRight"
				:size="button.size"
				:width="button.width"
				@onclick="button.action"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
