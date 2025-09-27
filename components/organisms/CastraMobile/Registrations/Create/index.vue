<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useCreateStore } from "~/stores/castra-mobile/registrations/useCreateStore";
import { useMobileEventStatusEnumStore } from "~/stores/Enums/useMobileEventStatusEnumStore";

export default defineComponent({
	name: "OrganismsCastraMobileRegistrationsCreate",
	async setup() {
		const createStore = useCreateStore();
		const { form } = createStore;

		const [optionsSpecies, optionsGender, optionsStatus] = await Promise.all([
			useAnimalSpeciesEnumStore().getOptions(),
			useGenderEnumStore().getOptions(),
			useMobileEventStatusEnumStore().getOptions(),
		]);

		const schedulerAt = ref("");

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
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
				label: "Criar registro de castração",
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
      schedulerAt,
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
    schedulerAt: {
      handler(newValue) {
        this.createStore.setFormField("scheduler_at", newValue);
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
          <MoleculesInputDate
            v-model="schedulerAt"
            label="Data de agendamento"
            name="scheduler_at"
            placeholder="YYYY-MM-DD"
            :min="useDayjs().format('YYYY-MM-DD')"
            width="35%"
            :required="true"
            :error-messages="form.end_date.errorMessages"
          />
					<MoleculesSelectsSimple
						max-width="35%"
						label="Evento de castração"
						:options="optionsSpecies"
						:message-error="form.mobile_clinic_event_id.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('mobile_clinic_event_id', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="Animal"
						:options="optionsGender"
						:message-error="form.animal_id.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('animal_id', $event)"
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
