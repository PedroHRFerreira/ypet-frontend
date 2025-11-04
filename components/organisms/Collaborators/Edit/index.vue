<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useCollaboratorRoleEnumStore } from "~/stores/Enums/useCollaboratorRoleEnumStore";
import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useEditStore } from "~/stores/collaborators/useEditStore";
import { useDetailStore } from "~/stores/collaborators/useDetailStore";

export default defineComponent({
	name: "OrganismsCollaboratorsEdit",
	async setup() {
		const editStore = useEditStore();
		const detailStore = useDetailStore();
		const { form } = editStore;
		const id = useRoute().params.id as string;

		editStore.clearForm();

		const [optionsStatus, optionsRoles] = await Promise.all([
			useUserStatusEnumStore().getOptions(),
			useCollaboratorRoleEnumStore().getOptions(),
		]);

		await detailStore.fetchById(id, {
			"with[]": ["user", "user.roles", "user.status"],
		});
		const collaborator = detailStore.detail;

		// Preenche o formulário com dados atuais
		editStore.setFormField("user_name", collaborator?.user?.name || "");
		editStore.setFormField("user_email", collaborator?.user?.email || "");
		editStore.setFormField(
			"work_started_at",
			collaborator?.work_started_at || "",
		);
		editStore.setFormField("observations", collaborator?.observations || "");

		// Seleciona Status atual baseado na API (user.status.status.value)
		const optionsStatusComputed = computed(() =>
			optionsStatus.map((item) => {
				const current = collaborator?.user?.status?.status?.value;
				if (String(item.id) === String(current)) {
					item.state = "activated";
					editStore.setFormField("user_status", item.id);
				}
				return item;
			}),
		);

		// Seleciona Função atual baseada na API (user.roles[0])
		const optionsRolesComputed = computed(() =>
			optionsRoles.map((item) => {
				const firstRole = collaborator?.user?.roles?.[0] || ({} as any);
				const roleMatch =
					String(item.id) === String(firstRole?.name) ||
					String(item.id) === String(firstRole?.id) ||
					String(item.id) === String(firstRole?.pivot?.role_id);
				if (roleMatch) {
					item.state = "activated";
					editStore.setFormField("user_role", item.id);
				}
				return item;
			}),
		);

		const startDate = ref(form.work_started_at.value as string);
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
			editStore.setFormField("cpf_cnpj", value);

			// Valida CPF/CNPJ quando o campo está completo
			if (value.length === 11 || value.length === 14) {
				const isValid = useValidateCpfCnpj(value);
				if (!isValid) {
					const docType = value.length === 11 ? "CPF" : "CNPJ";
					editStore.setFormError("cpf_cnpj", [`${docType} inválido`]);
				}
			}
		};

		const handleAccountTypeSelect = (value: string) => {
			selectedAccountType.value = value;
			editStore.setFormField("account_type", value);
		};

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
			confirm: {
				title: "Deseja salvar as alterações?",
				description: "Após confirmação, você verá as mudanças no painel",
				confirmText: "Confirmar",
				cancelText: "Cancelar",
				action: async () => {
					if (editStore.isLoading) return;
					await editStore.update(collaborator?.id || id);
					if (editStore.successMessage) showSuccess.value = true;
					showConfirm.value = false;
				},
			},
			success: {
				show: false,
				title: "Atualizado com sucesso!",
				description: "Visualize os dados na área de listagem.",
				continueText: "Continuar",
				action: () => {
					showSuccess.value = false;
					const router = useRouter();
					router.push({ name: "collaborators" });
				},
			},
		};

		const header = {
			title: {
				label: "Editar colaborador",
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
					text: "Salvar",
					type: "primary",
					icon: "save",
					iconLeft: true,
					nameIconLeft: "save",
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
			optionsRoles: optionsRolesComputed,
			optionsStatus: optionsStatusComputed,
			startDate,
			form,
			editStore,
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
				this.editStore.setFormField("work_started_at", newValue);
			},
			deep: true,
		},
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		key="confirmEditCollaborator"
		v-model:open="showConfirm"
		variant="confirm"
		:title="modalFeedback.confirm.title"
		:description="modalFeedback.confirm.description"
		:confirm-text="modalFeedback.confirm.confirmText"
		:cancel-text="modalFeedback.confirm.cancelText"
		@confirm="modalFeedback.confirm.action()"
	/>
	<MoleculesConfirmFeedbackModal
		key="successEditCollaborator"
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
						@on-input="editStore.setFormField('user_name', $event)"
					/>
					<MoleculesInputCommon
						label="Email"
						max-width="65%"
						type-input="email"
						:value="form.user_email.value"
						:is-disabled="true"
						:message-error="form.user_email.errorMessages.join(', ')"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="35%"
						label="Status"
						:options="optionsStatus"
						:value="form.user_status.value"
						:message-error="form.user_status.errorMessages.join(', ')"
						@item-selected="editStore.setFormField('user_status', $event.id)"
					/>
					<MoleculesSelectsSimple
						max-width="35%"
						label="Função"
						:options="optionsRoles"
						:value="form.user_role.value"
						:message-error="form.user_role.errorMessages.join(', ')"
						@item-selected="editStore.setFormField('user_role', $event.id)"
					/>
					<MoleculesInputDate
						v-model="startDate"
						label="Data de início do trabalho"
						name="work_started_at"
						width="30%"
						:disabled="true"
						:error-messages="form.work_started_at.errorMessages"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Observações"
						max-width="100%"
						:value="form.observations.value"
						:message-error="form.observations.errorMessages.join(', ')"
						@on-input="editStore.setFormField('observations', $event)"
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
			@update:pix-key="editStore.setFormField('pix_key', $event)"
			@update:bank-account-type="
				editStore.setFormField('bank_account_type', $event)
			"
			@update:bank="editStore.setFormField('bank', $event)"
			@update:agency="editStore.setFormField('agency', $event)"
			@update:account-number="editStore.setFormField('account_number', $event)"
			@update:account-holder="editStore.setFormField('account_holder', $event)"
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
