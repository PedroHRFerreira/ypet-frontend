<script lang="ts">
import { defineComponent } from "vue";
import { useRolesEnumStore } from "~/stores/Enums/useRolesEnumStore";
import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";

import { useCreateStore } from "~/stores/users/useCreateStore";

export default defineComponent({
	name: "OrganismsEmployeesCreate",
	async setup() {
		const createStore = useCreateStore();
		const { form } = createStore;

		const [optionsStatus, optionsRoles] = await Promise.all([
			useUserStatusEnumStore().getOptions(),
			useRolesEnumStore().getOptions(),
		]);

		const endDate = ref("");
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
				label: "Criar novo colaborador",
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
						:value="form.name.value"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="Email"
						max-width="65%"
						type-input="email"
						:value="form.email.value"
						:message-error="form.email.errorMessages.join(', ')"
						@on-input="createStore.setFormField('email', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputPassword
						label="Senha"
						max-width="50%"
						:value="form.password.value"
						:message-error="form.password.errorMessages.join(', ')"
						@oninput="createStore.setFormField('password', $event)"
					/>
					<MoleculesInputPassword
						max-width="50%"
						label="Confirmar Senha"
						:value="form.password_confirmation.value"
						:message-error="form.password_confirmation.errorMessages.join(', ')"
						@oninput="createStore.setFormField('password_confirmation', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="50%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('status', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="50%"
						label="Função"
						:options="optionsRoles"
						:message-error="form.roles.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('roles', $event)"
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
