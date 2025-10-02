<script lang="ts">
import { defineComponent } from "vue";
import { useCreateStore } from "~/stores/citizens/useCreateStore";

import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useBooleanEnumStore } from "~/stores/Enums/useBooleanEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";

export default defineComponent({
   name: "OrganismsCitizensCreate",
	async setup() {
		const useCitizensCreate = useCreateStore();
		const { form } = useCitizensCreate;
		const useUFEnum = useUFEnumStore();
		const useBooleanEnum = useBooleanEnumStore();
		const useUserStatusEnum = useUserStatusEnumStore();
		const useGenderEnum = useGenderEnumStore();
		

		const [
			optionsUserStatus,
			optionsUFEnum,
			optionsBoolean,
		] = await Promise.all([
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
		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function openConfirm() {
			showConfirm.value = true;
		}

		function onSuccess() {
			showSuccess.value = true;
		}
	
		function confirmCreate() {
			//
		}

		function continueFeedback() {
			//
		}

		return {
			optionsBoolean,
			optionsUserStatus,
			optionsUFEnum,
			optionsGender,
			showConfirm,
			showSuccess,
			useCitizensCreate,
			birthDate,
			form,
			openConfirm,
			onSuccess,
			confirmCreate,
			continueFeedback
		}
	}
})
</script>
<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar o cadastro no animal?"
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
					text="Sobre o cidadão"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="citizens__input-data__content">
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Nome"
						max-width="50%"
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="useCitizensCreate.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="CPF"
						max-width="25%"
						:value="form.document.value as string"
						:message-error="form.document.errorMessages.join(', ')"
						@on-input="useCitizensCreate.setFormField('document', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Gênero"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('gender', $event)"
					/>
				</div>
				<div class="citizens__input-data__content--group">
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
						:value="form.telephone.value as string"
						:message-error="form.telephone.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('telephone', $event)"
					/>
					<MoleculesInputCommon
						label="E-mail"
						max-width="50%"
						:value="form.email.value as string"
						:message-error="form.email.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('email', $event)"
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
						@item-selected="useCitizensCreate.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="Número"
						type-input="number"
						max-width="25%"
						:value="form.street.value as string"
						:message-error="form.street.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="CEP"
						max-width="25%"
						:value="form.zip_code.value as string"
						:message-error="form.zip_code.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('zip_code', $event)"
					/>
				</div>
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Bairro"
						max-width="50%"
						:value="form.district.value as string"
						:message-error="form.district.errorMessages.join(', ')"
						@item-selected="useCitizensCreate.setFormField('district', $event)"
					/>
					<MoleculesSelectsSimple
						label="Estado"
						max-width="25%"
						:options="optionsUFEnum"
						:message-error="form.state.errorMessages.join(', ')"
						@item-selected="useVeterinariansCreate.setFormField('state', $event)"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="25%"
					/>
				</div>
			</div>
		</section>
		<section class="citizens__input-data">
			<div class="citizens__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Permissões"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="citizens__input-data__content">
				<div class="citizens__input-data__content--group">
					<MoleculesInputOptionGroup
						name="Pode denunciar maus tratos"
						label="Pode denunciar maus tratos"
						max-width="25%"
						:options="optionsBoolean"
					/>
					<MoleculesInputOptionGroup
						name="Pode solicitar castramóvel"
						label="Pode solicitar castramóvel"
						max-width="25%"
						:options="optionsBoolean"
					/>
					<MoleculesSelectsSimple
						label="Status da conta"
						max-width="50%"
						:options="optionsUserStatus"
					/>
				</div>
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Observações"
						message="Descreva com detalhes suas observações finais"
						max-width="100%"
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