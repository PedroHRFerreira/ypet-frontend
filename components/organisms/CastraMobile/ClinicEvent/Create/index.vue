<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useCreateStore } from "~/stores/castra-mobile/clinic-events/useCreateStore";
import { useMobileEventStatusEnumStore } from "~/stores/Enums/useMobileEventStatusEnumStore";

export default defineComponent({
	name: "OrganismsClinicEventCreate",
	async setup() {
		const createStore = useCreateStore();
		const { form } = createStore;

		const [optionsSpecies, optionsGender, optionsStatus] = await Promise.all([
			useAnimalSpeciesEnumStore().getOptions(),
			useGenderEnumStore().getOptions(),
			useMobileEventStatusEnumStore().getOptions(),
		]);

		const endDate = ref("");
		const startDate = ref("");

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
			confirm: {
				title: "Deseja criar novo evento?",
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
		};

		const header = {
			title: {
				label: "Dados do evento",
				type: "text-p2",
				weight: "medium",
				color: "var(--brand-color-dark-blue-900)",
			},
			titleSecond: {
				label: "Regras do evento",
				type: "text-p2",
				weight: "medium",
				color: "var(--brand-color-dark-blue-900)",
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
		const clinicEventRules = ref([
			{
				specie: "dog",
				gender: "male",
				label: "Cão Macho",
				max_registrations: 0,
			},
			{
				specie: "dog",
				gender: "female",
				label: "Cão Fêmea",
				max_registrations: 0,
			},
			{
				specie: "cat",
				gender: "male",
				label: "Gato Macho",
				max_registrations: 0,
			},
			{
				specie: "cat",
				gender: "female",
				label: "Gato Fêmea",
				max_registrations: 0,
			},
		]);

		const changeMaxRegistrations = (index: number, value: string) => {
			const numValue = parseInt(value) || 0;
			clinicEventRules.value[index].max_registrations = numValue;
			const rules = clinicEventRules.value.map((rule) => ({
				specie: rule.specie,
				gender: rule.gender,
				max_registrations: rule.max_registrations,
			}));
			createStore.setFormField("rules", rules);
		};

		return {
			useDayjs,
			optionsGender,
			optionsSpecies,
			optionsStatus,
			endDate,
			startDate,
			form,
			createStore,
			header,
			footer,
			modalFeedback,
			showConfirm,
			showSuccess,
			clinicEventRules,
			changeMaxRegistrations,
		};
	},
	watch: {
		endDate: {
			handler(newValue) {
				this.createStore.setFormField("end_date", newValue);
			},
			deep: true,
		},
		startDate: {
			handler(newValue) {
				this.createStore.setFormField("start_date", newValue);
			},
			deep: true,
		},
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
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
		key="successCreateClinicEvent"
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
	/>
	<div class="settings-create">
		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.title.type"
					:text="header.title.label"
					:weight="header.title.weight"
					:color="header.title.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome"
						max-width="35%"
						:value="form.name.value"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="Descrição"
						max-width="65%"
						:value="form.description.value"
						:message-error="form.description.errorMessages.join(', ')"
						@on-input="createStore.setFormField('description', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="30%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('status', $event)"
					/>
					<MoleculesInputDate
						v-model="startDate"
						label="Data de início"
						name="start_date"
						placeholder="YYYY-MM-DD"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.start_date.errorMessages"
					/>
					<MoleculesInputDate
						v-model="endDate"
						label="Data de término"
						name="end_date"
						placeholder="YYYY-MM-DD"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.end_date.errorMessages"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Local do evento"
						max-width="100%"
						:value="form.location.value"
						:message-error="form.location.errorMessages.join(', ')"
						@on-input="createStore.setFormField('location', $event)"
					/>
				</div>
			</div>
		</section>

		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.titleSecond.type"
					:text="header.titleSecond.label"
					:weight="header.titleSecond.weight"
					:color="header.titleSecond.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<!-- Bloco de Cães -->
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Cão Macho"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="String(clinicEventRules[0].max_registrations)"
						@on-input="changeMaxRegistrations(0, $event)"
					/>
					<MoleculesInputCommon
						label="Cão Fêmea"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="String(clinicEventRules[1].max_registrations)"
						@on-input="changeMaxRegistrations(1, $event)"
					/>
				</div>

				<!-- Bloco de Gatos -->
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Gato Macho"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="String(clinicEventRules[2].max_registrations)"
						@on-input="changeMaxRegistrations(2, $event)"
					/>
					<MoleculesInputCommon
						label="Gato Fêmea"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="String(clinicEventRules[3].max_registrations)"
						@on-input="changeMaxRegistrations(3, $event)"
					/>
				</div>

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
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
