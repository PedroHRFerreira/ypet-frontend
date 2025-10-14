<script lang="ts">
import { defineComponent } from "vue";
import { useCollaboratorRoleEnumStore } from "~/stores/Enums/useCollaboratorRoleEnumStore";
import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";

import { useCreateStore } from "~/stores/collaborators/useCreateStore";

export default defineComponent({
	name: "OrganismsCollaboratorsCreate",
	async setup() {
		const createStore = useCreateStore();
		const { form } = createStore;

		const [optionsStatus, optionsRoles] = await Promise.all([
			useUserStatusEnumStore().getOptions(),
			useCollaboratorRoleEnumStore().getOptions(),
		]);

		const startDate = ref("");

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
			confirm: {
				title: "Deseja criar novo colaborador?",
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
				label: "Informações do colaborador",
				type: "text-p2",
				weight: "medium",
				color: "var(--brand-color-dark-blue-900)",
			},
			titleSecond: {
				label: "Dados bancários",
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
			optionsRoles,
			optionsStatus,
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
		startDate: {
			handler(newValue) {
				this.createStore.setFormField("work_started_at", newValue);
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
						:value="form.user_name.value"
						:message-error="form.user_name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('user_name', $event)"
					/>
					<MoleculesInputCommon
						label="Email"
						max-width="65%"
						type-input="email"
						:value="form.user_email.value"
						:message-error="form.user_email.errorMessages.join(', ')"
						@on-input="createStore.setFormField('user_email', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputPassword
						label="Senha"
						max-width="50%"
						:value="form.user_password.value"
						:message-error="form.user_password.errorMessages.join(', ')"
						@oninput="createStore.setFormField('user_password', $event)"
					/>
					<MoleculesInputPassword
						max-width="50%"
						label="Confirmar Senha"
						:value="form.user_password_confirmation.value"
						:message-error="
							form.user_password_confirmation.errorMessages.join(', ')
						"
						@oninput="
							createStore.setFormField('user_password_confirmation', $event)
						"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="35%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.user_status.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('user_status', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="35%"
						label="Função"
						:options="optionsRoles"
						:message-error="form.user_role.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('user_role', $event)"
					/>
					<MoleculesInputDate
						v-model="startDate"
						label="Data de início do trabalho"
						name="work_started_at"
						placeholder="YYYY-MM-DD"
						width="30%"
						:required="true"
						:error-messages="form.work_started_at.errorMessages"
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
