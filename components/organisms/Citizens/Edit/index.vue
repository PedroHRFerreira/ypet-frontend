<script lang="ts">
import { defineComponent } from "vue";

import { useUserStatusEnumStore } from "~/stores/Enums/useUserStatusEnumStore";
import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useDetailStore } from "~/stores/citizens/useDetailStore";
import { useEditStore } from "~/stores/citizens/useEditStore";

export default defineComponent({
   name: "OrganismsCitizensEdit",
	async setup() {
		const useCitizenDetailsStore = useDetailStore();
		const useCitizenEdit = useEditStore();
		const useUFEnum = useUFEnumStore();
		const useUserStatusEnum = useUserStatusEnumStore();
		const { form } = useCitizenEdit;
		const id = useRoute().params.id as string;

		const [
			userStatus,
			UFEnum,
		] = await Promise.all([
			useUserStatusEnum.getOptions(),
			useUFEnum.getOptions(),
			useCitizenDetailsStore.fetchCitizenById(id, {
				"with[]": ["user","addresses"],
			}),
		]);
		
		const citizen = useCitizenDetailsStore.citizens;
	
		const optionsUFEnum = computed(() =>
			UFEnum.map((item) => {
				if (item.id === citizen?.state) {
					item.state = "activated";
					useCitizenEdit.setFormField("state", item.id);
				}

				return item;
			}),
		);

		const gender: IOption[] = [
			{ id: 1, text: "Masculino", state: "default" },
			{ id: 0, text: "Feminino", state: "default" },
		];

		const optionsGender = computed(() => {
			return gender.map((item) => {
				if (item.id === citizen.gender) {
					item.state = "activated";
					useCitizenEdit.setFormField("gender", item.id);
				}

				return item;
			});
		});

		const optionsBoolean = computed((): IOption[] => {
			return [
				{ id: 1, text: "Sim", state: "default" },
				{ id: 0, text: "Não", state: "default" },
			];
		});

		const optionsUserStatus = computed(() =>
			userStatus.map((item) => {
			if (item.id === citizen?.status) { 
				item.state = "activated";
				useCitizenEdit.setFormField("status", item.id);
			}
				return item;
			}),
		);

		useCitizenEdit.setFormField("name", citizen?.user?.name || "");
		useCitizenEdit.setFormField("document",citizen?.document || "",);
		useCitizenEdit.setFormField("email", citizen?.user?.email || "");
		useCitizenEdit.setFormField("telephone",citizen?.user?.telephone || "");
		const mainAddress = citizen?.addresses?.[0];

		useCitizenEdit.setFormField("street", mainAddress?.street || "");
		useCitizenEdit.setFormField("number", mainAddress?.number || "");
		useCitizenEdit.setFormField("zip_code", mainAddress?.zip_code || "");
		useCitizenEdit.setFormField("district", mainAddress?.district || "");
		useCitizenEdit.setFormField("complement", mainAddress?.complement || "");
		useCitizenEdit.setFormField("state", mainAddress?.state || "");
		useCitizenEdit.setFormField("status", citizen?.status || "");
		const birthDate = ref(citizen.birth_date || "");
		
		
		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function openConfirm() {
			showConfirm.value = true;
		}

		function onSuccess() {
			showSuccess.value = true;
		}
	
		async function confirmUpdate() {
			if (useCitizenEdit.isLoading) {
				return;
			}

			await useCitizenEdit.update(id);

			if (useCitizenEdit.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
			useCitizenEdit.resetForm();

			const router = useRouter();
			router.push({ name: "citizens-list" });
		}

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
			optionsBoolean,
			optionsUserStatus,
			optionsUFEnum,
			optionsGender,
			showConfirm,
			showSuccess,
			useCitizenEdit,
			birthDate,
			form,
			footer,
			openConfirm,
			onSuccess,
			confirmUpdate,
			continueFeedback
		}
	},
	watch: {
		birthDate: {
			handler(newValue) {
				this.useCitizenEdit.setFormField("birth_date", newValue);
			},
			deep: true,
		},
	},
})
</script>
<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar o cadastro no cidadão?"
		description="Após confirmação, você irá visualizá-lo no painel"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmUpdate"
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
						@on-input="useCitizenEdit.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="CPF"
						max-width="25%"
						:value="form.document.value as string"
						:message-error="form.document.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('document', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Gênero"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="useCitizenEdit.setFormField('gender', $event)"
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
						@on-input="useCitizenEdit.setFormField('telephone', $event)"
					/>
					<MoleculesInputCommon
						label="E-mail"
						max-width="50%"
						:value="form.email.value as string"
						:message-error="form.email.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('email', $event)"
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
						@on-input="useCitizenEdit.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="Número"
						type-input="number"
						max-width="25%"
						:value="form.number.value as string"
						:message-error="form.number.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('number', $event)"
					/>
					<MoleculesInputCommon
						label="CEP"
						max-width="25%"
						:value="form.zip_code.value as string"
						:message-error="form.zip_code.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('zip_code', $event)"
					/>
				</div>
				<div class="citizens__input-data__content--group">
					<MoleculesInputCommon
						label="Bairro"
						max-width="50%"
						:value="form.district.value as string"
						:message-error="form.district.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('district', $event)"
					/>
					<MoleculesSelectsSimple
						label="Estado"
						max-width="25%"
						:options="optionsUFEnum"
						:message-error="form.state.errorMessages.join(', ')"
						@item-selected="useCitizenEdit.setFormField('state', $event)"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="25%"
						:value="form.complement.value as string"
						:message-error="form.complement.errorMessages.join(', ')"
						@on-input="useCitizenEdit.setFormField('complement', $event)"
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
						:value="
							form.can_report_abuse.value
								? form.can_report_abuse.value
								: 0
						"
						:message-error="
							form.can_report_abuse.errorMessages.join(', ')
						"
						@change-option="
							useCitizenEdit.setFormField(
								'can_report_abuse',
								$event.id,
							)
						"
					/>
					<MoleculesInputOptionGroup
						name="Pode solicitar castramóvel"
						label="Pode solicitar castramóvel"
						max-width="25%"
						:options="optionsBoolean"
						:value="
							form.can_mobile_castration.value
								? form.can_mobile_castration.value
								: 0
						"
						:message-error="
							form.can_mobile_castration.errorMessages.join(', ')
						"
						@change-option="
							useCitizenEdit.setFormField(
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
						@item-selected="useCitizenEdit.setFormField('status', $event)"
						
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