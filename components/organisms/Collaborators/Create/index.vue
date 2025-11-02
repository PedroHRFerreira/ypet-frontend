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
		const cpfCnpj = ref("");
		const selectedAccountType = ref<string | null>(null);

		const accountTypeOptions = [
			{ id: "pix", text: "PIX", state: "default" as const },
			{ id: "bank_account", text: "Conta Bancária", state: "default" as const },
		];

		const bankAccountTypeOptions = [
			{ id: "checking", text: "Conta Corrente", state: "default" as const },
			{ id: "savings", text: "Conta Poupança", state: "default" as const },
		];

		const maskedCpfCnpj = computed(() => {
			return cpfCnpj.value ? useMaskDocument(cpfCnpj.value) : "";
		});

		const handleCpfCnpjInput = (value: string) => {
			cpfCnpj.value = value;
			createStore.setFormField("cpf_cnpj", value);

			// Valida CPF/CNPJ quando o campo está completo
			if (value.length === 11 || value.length === 14) {
				const isValid = useValidateCpfCnpj(value);
				if (!isValid) {
					const docType = value.length === 11 ? "CPF" : "CNPJ";
					createStore.setFormError("cpf_cnpj", [`${docType} inválido`]);
				}
			}
		};

		const handleAccountTypeSelect = (value: string) => {
			selectedAccountType.value = value;
			createStore.setFormField("account_type", value);
		};

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
			cpfCnpj,
			maskedCpfCnpj,
			handleCpfCnpjInput,
			accountTypeOptions,
			bankAccountTypeOptions,
			selectedAccountType,
			handleAccountTypeSelect,
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

		<!-- Dados bancários -->
		<MoleculesFormsBankingData
			:cpf-cnpj-value="cpfCnpj"
			:account-type-value="selectedAccountType"
			:pix-key-value="form.pix_key.value"
			:bank-account-type-value="form.bank_account_type.value"
			:bank-value="form.bank.value"
			:agency-value="form.agency.value"
			:account-number-value="form.account_number.value"
			:account-holder-value="form.account_holder.value"
			:cpf-cnpj-error="form.cpf_cnpj.errorMessages.join(', ')"
			:account-type-error="form.account_type.errorMessages.join(', ')"
			:pix-key-error="form.pix_key.errorMessages.join(', ')"
			:bank-account-type-error="form.bank_account_type.errorMessages.join(', ')"
			:bank-error="form.bank.errorMessages.join(', ')"
			:agency-error="form.agency.errorMessages.join(', ')"
			:account-number-error="form.account_number.errorMessages.join(', ')"
			:account-holder-error="form.account_holder.errorMessages.join(', ')"
			@update:cpf-cnpj="handleCpfCnpjInput"
			@update:account-type="handleAccountTypeSelect"
			@update:pix-key="createStore.setFormField('pix_key', $event)"
			@update:bank-account-type="
				createStore.setFormField('bank_account_type', $event)
			"
			@update:bank="createStore.setFormField('bank', $event)"
			@update:agency="createStore.setFormField('agency', $event)"
			@update:account-number="
				createStore.setFormField('account_number', $event)
			"
			@update:account-holder="
				createStore.setFormField('account_holder', $event)
			"
		/>

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
