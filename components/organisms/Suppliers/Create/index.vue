<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import { useCreateStore } from "~/stores/suppliers/useCreateStore";

import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useBooleanEnumStore } from "~/stores/Enums/useBooleanEnumStore";

export default defineComponent({
	name: "OrganismsSuppliersCreate",
	async setup() {
		const useSuppliersCreate = useCreateStore();
		const { form } = useSuppliersCreate;
		const useUFEnum = useUFEnumStore();
		const useBooleanEnum = useBooleanEnumStore();
		const useUserStatusEnum = useUserStatusEnumStore();

		onUnmounted(() => {
			useSuppliersCreate.resetForm();
		});

		const [optionsUserStatus, optionsUFEnum, optionsBoolean] =
			await Promise.all([
				useUserStatusEnum.getOptions(),
				useUFEnum.getOptions(),
				useBooleanEnum.getOptions(),
			]);

		const document = ref("");
		const telephone = ref("");
		const cellphone = ref("");
		const zipCode = ref("");
		const errorMessage = ref("");
		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function openConfirm() {
			showConfirm.value = true;
		}

		function onSuccess() {
			showSuccess.value = true;
		}

		async function confirmCreate() {
			if (useSuppliersCreate.isLoading) {
				return;
			}

			await useSuppliersCreate.create();

			if (useSuppliersCreate.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
			useSuppliersCreate.resetForm();

			const router = useRouter();
			router.push({ name: "suppliers-list" });
		}

		function onInputDocument(value: string) {
			document.value = useMaskDocument(value);
			useSuppliersCreate.setFormField("document", value.replace(/\D/g, ""));
		}

		function onInputTelephone(value: string) {
			let digits = value.replace(/\D/g, "");
			digits = digits.slice(0, 11);
			telephone.value = digits;
			useSuppliersCreate.setFormField("telephone", digits);
		}

		function onInputCellphone(value: string) {
			let digits = value.replace(/\D/g, "");
			digits = digits.slice(0, 11);
			cellphone.value = digits;
			useSuppliersCreate.setFormField("cellphone", digits);
		}

		function onInputZipCode(value: string) {
			zipCode.value = useMaskZipCode(value);
			useSuppliersCreate.setFormField("zip_code", value.replace(/\D/g, ""));
		}

		function handleError(message: string) {
			errorMessage.value = message;
		}

		return {
			optionsBoolean,
			optionsUserStatus,
			optionsUFEnum,
			showConfirm,
			showSuccess,
			useSuppliersCreate,
			form,
			document,
			telephone,
			cellphone,
			zipCode,
			onInputDocument,
			onInputTelephone,
			onInputCellphone,
			onInputZipCode,
			openConfirm,
			onSuccess,
			confirmCreate,
			continueFeedback,
			errorMessage,
			handleError,
		};
	},
});
</script>
<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar o cadastro?"
		description="Após confirmação, você irá visualizá-lo no painel"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmCreate"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Cadastro realizado com sucesso"
		description="Visualize os dados na área de cadastro."
		continue-text="Continuar"
		@continue="continueFeedback"
	/>
	<div class="citizens">
		<section class="citizens__input-data">
			<div class="citizens__about__header">
				<AtomsTypography
					type="text-p2"
					text="Sobre o fornecedor"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="citizens__input-data__content">
				<div class="citizens__input-data__content--group">
					<div class="citizens__input-data__content">
						<div class="citizens__input-data__content--group">
							<MoleculesInputCommon
								label="CNPJ"
								max-width="25%"
								:maxlength="18"
								:value="document as string"
								:message-error="form.document.errorMessages.join(', ')"
								@on-input="onInputDocument($event)"
							/>
							<MoleculesInputCommon
								label="Razão Social"
								max-width="50%"
								:value="form.legal_name.value as string"
								:message-error="form.legal_name.errorMessages.join(', ')"
								@on-input="
									useSuppliersCreate.setFormField('legal_name', $event)
								"
							/>
							<MoleculesInputCommon
								label="Nome Fantasia"
								max-width="50%"
								:value="form.business_name.value as string"
								:message-error="form.business_name.errorMessages.join(', ')"
								@on-input="
									useSuppliersCreate.setFormField('business_name', $event)
								"
							/>
						</div>
						<div class="citizens__input-data__content--group">
							<MoleculesInputCommon
								label="Inscrição Municipal"
								max-width="25%"
								:maxlength="14"
								:value="form.municipal_registration.value as string"
								:message-error="
									form.municipal_registration.errorMessages.join(', ')
								"
								@on-input="
									useSuppliersCreate.setFormField(
										'municipal_registration',
										$event,
									)
								"
							/>
							<MoleculesInputCommon
								label="Inscrição Estadual"
								max-width="25%"
								:maxlength="14"
								:value="form.state_registration.value as string"
								:message-error="
									form.state_registration.errorMessages.join(', ')
								"
								@on-input="
									useSuppliersCreate.setFormField('state_registration', $event)
								"
							/>
							<MoleculesInputCommon
								label="Representante"
								max-width="50%"
								:maxlength="14"
								:value="form.representative.value as string"
								:message-error="form.representative.errorMessages.join(', ')"
								@on-input="
									useSuppliersCreate.setFormField('representative', $event)
								"
							/>
						</div>
						<div class="citizens__input-data__content--group">
							<!-- Campos de contato movidos para a seção própria abaixo -->
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="citizens__input-data">
			<div class="citizens__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Contato"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="citizens__input-data__content">
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Telefone"
						max-width="25%"
						:maxlength="11"
						:value="telephone as string"
						:message-error="form.telephone.errorMessages.join(', ')"
						@on-input="onInputTelephone($event)"
					/>
					<MoleculesInputCommon
						label="Celular"
						max-width="25%"
						:maxlength="11"
						:value="cellphone as string"
						:message-error="form.cellphone.errorMessages.join(', ')"
						@on-input="onInputCellphone($event)"
					/>
					<MoleculesInputCommon
						label="E-mail"
						max-width="50%"
						:value="form.email.value as string"
						:message-error="form.email.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('email', $event)"
					/>
				</div>
			</div>
		</section>
		<section class="citizens__input-data">
			<div class="citizens__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Endereço"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="citizens__input-data__content">
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Rua"
						max-width="50%"
						:value="form.street.value as string"
						:message-error="form.street.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="Número"
						type-input="number"
						max-width="25%"
						:value="form.number.value as string"
						:message-error="form.number.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('number', $event)"
					/>
					<MoleculesInputCommon
						label="CEP"
						:maxlength="9"
						max-width="25%"
						:value="zipCode as string"
						:message-error="form.zip_code.errorMessages.join(', ')"
						@on-input="onInputZipCode($event)"
					/>
				</div>
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Bairro"
						max-width="25%"
						:value="form.district?.value as string"
						:message-error="form.district?.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('district', $event)"
					/>
					<MoleculesInputCommon
						label="Cidade"
						max-width="25%"
						:value="form.city.value as string"
						:message-error="form.city.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('city', $event)"
					/>
					<MoleculesSelectsSimple
						label="Estado"
						max-width="25%"
						:options="optionsUFEnum"
						:message-error="form.state.errorMessages.join(', ')"
						@item-selected="useSuppliersCreate.setFormField('state', $event.id)"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="25%"
						:value="form.complement.value as string"
						:message-error="form.complement.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('complement', $event)"
					/>
					<MoleculesInputCommon
						label="País"
						max-width="25%"
						:value="form.country.value as string"
						:message-error="form.country.errorMessages.join(', ')"
						@on-input="useSuppliersCreate.setFormField('country', $event)"
					/>
				</div>
			</div>
			<div class="citizens__input-data__footer">
				<MoleculesButtonsCommon
					type="primary"
					text="Cadastrar"
					width="128px"
					:icon-right="true"
					name-icon-right="plus"
					@onclick="openConfirm"
				/>
			</div>
		</section>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";

.header__container--item {
	position: relative;
	cursor: pointer;

	&__select {
		padding: 8px;
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: var(--brand-color-white);
		color: var(--brand-color-dark-blue-300);
		font-size: 14px;
		font-weight: 500;
		transition:
			background-color 0.3s,
			color 0.3s;

		&:hover {
			background-color: var(--brand-color-dark-blue-100);
			color: var(--brand-color-dark-blue-900);
		}
	}

	&__dropdown {
		position: absolute;
		top: 110%;
		right: 0;
		background-color: var(--white);
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 150px;
	}
}
</style>
