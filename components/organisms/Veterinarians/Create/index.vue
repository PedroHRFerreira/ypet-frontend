<script lang="ts">
import { defineComponent } from "vue";
import { useCreateStore } from "~/stores/veterinarians/useCreateStore";

import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useLinkedTypeEnumStore } from "~/stores/Enums/useLinkedTypeEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useBooleanEnumStore } from "~/stores/Enums/useBooleanEnumStore";

export default defineComponent({
	name: "OrganismsVeterinariansCreate",
	async setup() {
		const useVeterinariansCreate = useCreateStore();
		const useUFEnum = useUFEnumStore();
		const useUserStatusEnum = useUserStatusEnumStore();
		const useLinkedTypeEnum = useLinkedTypeEnumStore();
		const useBooleanEnum = useBooleanEnumStore();
		const { form } = useVeterinariansCreate;

		const [
			optionsUserStatus,
			optionsLinkedType,
			optionsUFEnum,
			optionsBoolean,
		] = await Promise.all([
			useUserStatusEnum.getOptions(),
			useLinkedTypeEnum.getOptions(),
			useUFEnum.getOptions(),
			useBooleanEnum.getOptions(),
		]);

		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const modalFeedback = {
			confirm: {
				title: "Deseja confirmar a criação?",
				description: "Após confirmação, você irá visualizá-lo no painel",
				confirmText: "Confirmar",
				cancelText: "Cancelar",
				action: async () => {
					if (useVeterinariansCreate.isLoading) {
						return;
					}

					await useVeterinariansCreate.create();

					if (useVeterinariansCreate.successMessage) {
						showSuccess.value = true;
					}

					showConfirm.value = false;
				},
			},
			success: {
				show: false,
				title: "Atualizado com sucesso",
				description: "Visualize os dados na área de listagem.",
				continueText: "Continuar",
				action: () => {
					showSuccess.value = false;
					const router = useRouter();
					router.push({ name: "veterinarians-list" });
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

		return {
			optionsUserStatus,
			optionsLinkedType,
			optionsBoolean,
			optionsUFEnum,
			form,
			useVeterinariansCreate,
			showConfirm,
			showSuccess,
			modalFeedback,
			footer,
		};
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		:title="modalFeedback.confirm.title"
		:description="modalFeedback.confirm.description"
		:confirm-text="modalFeedback.confirm.confirmText"
		:cancel-text="modalFeedback.confirm.cancelText"
		@confirm="modalFeedback.confirm.action()"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
	/>
	<div class="animal">
		<section class="animal__about-pet">
			<div class="animal__about-pet__header">
				<AtomsTypography
					type="text-p2"
					text="Sobre o Veterinário"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="animal__about-pet__content">
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome"
						max-width="50%"
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="CPF"
						max-width="25%"
						:value="form.document.value as string"
						:message-error="form.document.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('document', $event)"
					/>
					<MoleculesInputCommon
						label="CRMV"
						max-width="25%"
						:value="form.crmv.value as string"
						:message-error="form.crmv.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('crmv', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="UF"
						:options="optionsUFEnum"
						:message-error="form.uf.errorMessages.join(', ')"
						@item-selected="useVeterinariansCreate.setFormField('uf', $event)"
					/>
				</div>
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Email"
						max-width="40%"
						:value="form.email.value as string"
						:message-error="form.email.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('email', $event)"
					/>
					<MoleculesInputCommon
						label="Senha"
						max-width="30%"
						:value="form.password.value as string"
						:message-error="form.password.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('password', $event)"
					/>
					<MoleculesInputCommon
						label="Confirmar Senha"
						max-width="30%"
						:value="form.password_confirmation.value as string"
						:message-error="form.password_confirmation.errorMessages.join(', ')"
						@on-input="
							useVeterinariansCreate.setFormField(
								'password_confirmation',
								$event,
							)
						"
					/>
				</div>
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Telefone/WhatsApp"
						max-width="25%"
						:value="form.phone.value as string"
						:message-error="form.phone.errorMessages.join(', ')"
						@on-input="useVeterinariansCreate.setFormField('phone', $event)"
					/>
					<MoleculesInputCommon
						label="Instituição vinculada"
						max-width="40%"
						:value="form.linked_institution.value as string"
						:message-error="form.linked_institution.errorMessages.join(', ')"
						@on-input="
							useVeterinariansCreate.setFormField('linked_institution', $event)
						"
					/>
					<MoleculesSelectsSimple
						max-width="35%"
						label="Tipo de vínculo"
						:options="optionsLinkedType"
						:message-error="form.linked_type.errorMessages.join(', ')"
						@item-selected="
							useVeterinariansCreate.setFormField('linked_type', $event)
						"
					/>
				</div>
			</div>
		</section>
		<section class="animal__input-data">
			<div class="animal__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Permissões"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="animal__input-data__content">
				<div class="animal__input-data__content--group">
					<MoleculesInputOptionGroup
						name="Pode acessar Castramóvel"
						label="Pode acessar Castramóvel"
						max-width="30%"
						:options="optionsBoolean"
						:value="
							form.permissions_can_access_castromovel.value
								? form.permissions_can_access_castromovel.value
								: 0
						"
						:message-error="
							form.permissions_can_access_castromovel.errorMessages.join(', ')
						"
						@change-option="
							useVeterinariansCreate.setFormField(
								'permissions_can_access_castromovel',
								$event.id,
							)
						"
					/>
					<MoleculesInputOptionGroup
						name="Pode aplicar vacinas"
						label="Pode aplicar vacinas"
						max-width="30%"
						:options="optionsBoolean"
						:value="
							form.permissions_can_apply_vaccine.value
								? form.permissions_can_apply_vaccine.value
								: 0
						"
						:message-error="
							form.permissions_can_apply_vaccine.errorMessages.join(', ')
						"
						@change-option="
							useVeterinariansCreate.setFormField(
								'permissions_can_apply_vaccine',
								$event.id,
							)
						"
					/>
					<MoleculesSelectsSimple
						max-width="40%"
						label="Status"
						:options="optionsUserStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="
							useVeterinariansCreate.setFormField('status', $event)
						"
					/>
				</div>
				<div class="animal__input-data__content--group">
					<MoleculesInputCommon
						label="Observações"
						max-width="100%"
						:value="form.observations.value as string"
						:message-error="form.observations.errorMessages.join(', ')"
						@on-input="
							useVeterinariansCreate.setFormField('observations', $event)
						"
					/>
				</div>
			</div>
			<div class="animal__input-data__footer">
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
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
