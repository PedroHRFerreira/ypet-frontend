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
				label: "Criar evento clínico",
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
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="Descrição"
						max-width="65%"
						:value="form.description.value as string"
						:message-error="form.description.errorMessages.join(', ')"
						@on-input="createStore.setFormField('description', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="35%"
						label="Tipo de Pet"
						:options="optionsSpecies"
						:message-error="form.species.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('species', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="35%"
						label="Sexo"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('gender', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('status', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Max. de vagas"
						type-input="number"
						max-width="30%"
						:maxlength="2"
						:value="form.max_registrations.value as string"
						:message-error="form.max_registrations.errorMessages.join(', ')"
						@on-input="createStore.setFormField('max_registrations', $event)"
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
						:value="form.location.value as string"
						:message-error="form.location.errorMessages.join(', ')"
						@on-input="createStore.setFormField('location', $event)"
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
