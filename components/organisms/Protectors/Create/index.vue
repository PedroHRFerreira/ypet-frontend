<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import { useZipcodeLookup } from "~/composables/useZipcodeLookup";
import { useCreateStore } from "~/stores/protectors/useCreateStore";
import MoleculesUploadField from "~/components/molecules/ListCardItem/index.vue";

import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useBooleanEnumStore } from "~/stores/Enums/useBooleanEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";

export default defineComponent({
	name: "OrganismsProtectorsCreate",
	components: {
		MoleculesUploadField,
	},
	async setup() {
		const useProtectorsCreate = useCreateStore();
		const { form } = useProtectorsCreate;
		const useUFEnum = useUFEnumStore();
		const useBooleanEnum = useBooleanEnumStore();
		const useUserStatusEnum = useUserStatusEnumStore();
		const useGenderEnum = useGenderEnumStore();
		useProtectorsCreate.setFormField("can_mobile_castration", 0);
		useProtectorsCreate.setFormField("can_report_abuse", 0);

		onUnmounted(() => {
			useProtectorsCreate.resetForm();
		});

		const [optionsUserStatus, optionsUFEnum, optionsBoolean] =
			await Promise.all([
				useUserStatusEnum.getOptions(),
				useUFEnum.getOptions(),
				useBooleanEnum.getOptions(),
				useGenderEnum.getOptions(),
			]);

		const optionsGender: IOption[] = [
			{ id: 1, text: "Masculino", state: "default" },
			{ id: 0, text: "Feminino", state: "default" },
		];

		const birthDate = ref("");
		const document = ref("");
		const telephone = ref("");
		const zipCode = ref("");
		const file = ref<File | null>(null);
		const errorMessage = ref("");
		const showConfirm = ref(false);
		const showSuccess = ref(false);
		const { fetchAddress } = useZipcodeLookup();

		function openConfirm() {
			showConfirm.value = true;
		}

		function onSuccess() {
			showSuccess.value = true;
		}

		async function confirmCreate() {
			if (useProtectorsCreate.isLoading) {
				return;
			}

			await useProtectorsCreate.create();

			if (useProtectorsCreate.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
			useProtectorsCreate.resetForm();

			const router = useRouter();
			router.push({ name: "protectors-list" });
		}

		function onInputDocument(value: string) {
			document.value = useMaskDocument(value);
			useProtectorsCreate.setFormField("document", value.replace(/\D/g, ""));
		}

		function onInputTelephone(value: string) {
			telephone.value = usePhoneFormatter11BR(value);
			useProtectorsCreate.setFormField("telephone", value.replace(/\D/g, ""));
		}

		async function onInputZipCode(value: string) {
			zipCode.value = useMaskZipCode(value);
			const digits = value.replace(/\D/g, "");
			useProtectorsCreate.setFormField("zip_code", digits);

			if (digits.length === 8) {
				const data = await fetchAddress(digits);
				if (data) {
					useProtectorsCreate.setFormField("street", data.street);
					useProtectorsCreate.setFormField("district", data.district);
					useProtectorsCreate.setFormField("city", data.city);
					const ufOpt = optionsUFEnum.find(
						(o) =>
							(o as any).id === data.state || (o as any).text === data.state,
					);
					if (ufOpt) {
						useProtectorsCreate.setFormField("state", (ufOpt as any).id);
					}
				}
			}
		}

		function handleInputFile(payload: string | File) {
			if (payload instanceof File) {
				file.value = payload;
				useProtectorsCreate.setFormField("picture", payload);
			} else {
				// Para criar, sempre enviamos File; ignorar strings/base64
				console.log("Upload retornou string/base64, ignorado no create.");
			}
		}

		function handleChange(selectedFile: File) {
			// Alinhar ao comportamento da edição: sempre atualizar o campo 'picture'
			file.value = selectedFile;
			useProtectorsCreate.setFormField("picture", selectedFile);
		}

		function handleError(message: string) {
			errorMessage.value = message;
			// Limpa arquivo e registra erro no campo 'picture' (igual edição)
			file.value = null;
			useProtectorsCreate.setFormField("picture", null);
			useProtectorsCreate.setFormError("picture", [message]);
		}

		return {
			optionsBoolean,
			optionsUserStatus,
			optionsUFEnum,
			optionsGender,
			showConfirm,
			showSuccess,
			useProtectorsCreate,
			birthDate,
			form,
			document,
			telephone,
			zipCode,
			onInputDocument,
			onInputTelephone,
			onInputZipCode,
			openConfirm,
			onSuccess,
			confirmCreate,
			continueFeedback,
			file,
			errorMessage,
			handleInputFile,
			handleChange,
			handleError,
		};
	},
	watch: {
		birthDate: {
			handler(newValue) {
				this.useProtectorsCreate.setFormField("birth_date", newValue);
			},
			deep: true,
		},
	},
});
</script>
<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar o cadastro no cidadão?"
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
	<div class="protectors">
		<section class="protectors__input-data">
			<div class="protectors__about__header">
				<AtomsTypography
					type="text-p2"
					text="Sobre o cidadão"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="protectors__input-data__content">
				<div class="protectors__input-data__content--group">
					<MoleculesUploadField
						label="Selecione um arquivo para enviar"
						description="Arquivo até 2mb"
						maxWidth="30%"
						:accept="'image/*'"
						:maxSize="2 * 1024 * 1024"
						:maxHeight="188"
						:value="form.picture.value as any"
						@input="handleInputFile"
						@change="handleChange"
						@error="handleError"
					/>
					<div class="protectors__input-data__content">
						<div class="protectors__input-data__content--group">
							<MoleculesInputCommon
								label="Nome"
								max-width="50%"
								:value="form.name.value as string"
								:message-error="form.name.errorMessages.join(', ')"
								@on-input="useProtectorsCreate.setFormField('name', $event)"
							/>
							<MoleculesInputCommon
								label="CPF"
								max-width="25%"
								:maxlength="14"
								:value="document as string"
								:message-error="form.document.errorMessages.join(', ')"
								@on-input="onInputDocument($event)"
							/>
							<MoleculesSelectsSimple
								max-width="25%"
								label="Gênero"
								:options="optionsGender"
								:message-error="form.gender.errorMessages.join(', ')"
								@item-selected="
									useProtectorsCreate.setFormField('gender', $event)
								"
							/>
						</div>
						<div class="protectors__input-data__content--group">
							<MoleculesInputDate
								v-model="birthDate"
								label="Data de nascimento"
								name="birth_date"
								placeholder="YYYY-MM-DD"
								min="1900-01-01"
								max="2025-12-31"
								width="25%"
								:required="true"
								:error-messages="form.birth_date.errorMessages"
							/>
							<MoleculesInputCommon
								label="Telefone"
								max-width="25%"
								:maxlength="19"
								:value="telephone as string"
								:message-error="form.telephone.errorMessages.join(', ')"
								@on-input="onInputTelephone($event)"
							/>
							<MoleculesInputCommon
								label="E-mail"
								max-width="50%"
								:value="form.email.value as string"
								:message-error="form.email.errorMessages.join(', ')"
								@on-input="useProtectorsCreate.setFormField('email', $event)"
							/>
						</div>
					</div>
				</div>
				<div class="protectors__input-data__content--group"></div>
			</div>
		</section>
		<section class="protectors__input-data">
			<div class="protectors__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Endereço"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="protectors__input-data__content">
				<div class="protectors__input-data__content--group">
					<MoleculesInputCommon
						label="CEP"
						:maxlength="9"
						max-width="25%"
						:value="zipCode as string"
						:message-error="form.zip_code.errorMessages.join(', ')"
						@on-input="onInputZipCode($event)"
					/>
					<MoleculesInputCommon
						label="Rua"
						max-width="50%"
						:value="form.street.value as string"
						:message-error="form.street.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="Número"
						type-input="number"
						max-width="25%"
						:value="form.number.value as string"
						:message-error="form.number.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('number', $event)"
					/>
				</div>
				<div class="protectors__input-data__content--group">
					<MoleculesInputCommon
						label="Bairro"
						max-width="25%"
						:value="form.district.value as string"
						:message-error="form.district.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('district', $event)"
					/>
					<MoleculesInputCommon
						label="Cidade"
						max-width="25%"
						:value="form.city.value as string"
						:message-error="form.city.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('city', $event)"
					/>
					<MoleculesSelectsSimple
						label="Estado"
						max-width="25%"
						:options="optionsUFEnum"
						:message-error="form.state.errorMessages.join(', ')"
						@item-selected="useProtectorsCreate.setFormField('state', $event)"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="25%"
						:value="form.complement.value as string"
						:message-error="form.complement.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('complement', $event)"
					/>
				</div>
			</div>
		</section>
		<section class="protectors__input-data">
			<div class="protectors__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Permissões"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="protectors__input-data__content">
				<div class="protectors__input-data__content--group">
					<MoleculesInputOptionGroup
						name="Pode denunciar maus tratos"
						label="Pode denunciar maus tratos"
						max-width="25%"
						:options="optionsBoolean"
						:value="form.can_report_abuse.value"
						:message-error="form.can_report_abuse.errorMessages.join(', ')"
						@change-option="
							useProtectorsCreate.setFormField('can_report_abuse', $event.id)
						"
					/>
					<MoleculesInputOptionGroup
						name="Pode solicitar castramóvel"
						label="Pode solicitar castramóvel"
						max-width="25%"
						:options="optionsBoolean"
						:value="form.can_mobile_castration.value"
						:message-error="form.can_mobile_castration.errorMessages.join(', ')"
						@change-option="
							useProtectorsCreate.setFormField(
								'can_mobile_castration',
								$event.id,
							)
						"
					/>
					<MoleculesSelectsSimple
						label="Status da conta"
						max-width="50%"
						:options="optionsUserStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="useProtectorsCreate.setFormField('status', $event)"
					/>
				</div>
				<div class="protectors__input-data__content--group">
					<MoleculesInputCommon
						label="Observações"
						message="Descreva com detalhes suas observações finais"
						max-width="100%"
						:value="form.observations.value as string"
						:message-error="form.observations.errorMessages.join(', ')"
						@on-input="useProtectorsCreate.setFormField('observations', $event)"
					/>
				</div>
			</div>
			<div class="protectors__input-data__footer">
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
