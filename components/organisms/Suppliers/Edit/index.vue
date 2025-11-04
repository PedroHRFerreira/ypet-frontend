<script lang="ts">
import { defineComponent } from "vue";

import { useUFEnumStore } from "~/stores/Enums/useUFEnumStore";
import { useDetailStore } from "~/stores/suppliers/useDetailStore";
import { useEditStore } from "~/stores/suppliers/useEditStore";
import { useZipcodeLookup } from "~/composables/useZipcodeLookup";

export default defineComponent({
	name: "OrganismsSuppliersEdit",
	async setup() {
		const suppliersDetailsStore = useDetailStore();
		const useSuppliersEdit = useEditStore();
		const useUFEnum = useUFEnumStore();
		const { form } = useSuppliersEdit;
		const { fetchAddress } = useZipcodeLookup();
		const id = useRoute().params.id as string;

		const [UFEnum] = await Promise.all([
			useUFEnum.getOptions(),
			suppliersDetailsStore.fetchSupplierById(id, {
				"with[]": ["contacts", "addresses"],
			}),
		]);

		const supplier = suppliersDetailsStore.supplier;
		const mainAddress = supplier?.addresses?.[0] || ({} as any);
		const mainContact = (supplier as any)?.contacts?.[0] || {};

		// Prefill state directly from address to guarantee presence
		if (mainAddress?.state) {
			useSuppliersEdit.setFormField("state", mainAddress.state);
		}

		const optionsUFEnum = computed(() =>
			UFEnum.map((item) => {
				if (item.value === mainAddress?.state) {
					item.state = "activated";
					useSuppliersEdit.setFormField("state", item.id);
				}
				return item;
			}),
		);

		useSuppliersEdit.setFormField("legal_name", supplier?.legal_name || "");
		useSuppliersEdit.setFormField(
			"business_name",
			supplier?.business_name || "",
		);
		useSuppliersEdit.setFormField(
			"municipal_registration",
			supplier?.municipal_registration || "",
		);
		useSuppliersEdit.setFormField(
			"state_registration",
			supplier?.state_registration || "",
		);
		useSuppliersEdit.setFormField(
			"representative",
			supplier?.representative || "",
		);
		useSuppliersEdit.setFormField("document", supplier?.document || "");

		useSuppliersEdit.setFormField("email", mainContact?.email || "");
		useSuppliersEdit.setFormField("telephone", mainContact?.telephone || "");
		useSuppliersEdit.setFormField("cellphone", mainContact?.cellphone || "");

		useSuppliersEdit.setFormField("street", mainAddress?.street || "");
		useSuppliersEdit.setFormField("number", mainAddress?.number || "");
		useSuppliersEdit.setFormField("district", mainAddress?.district || "");
		useSuppliersEdit.setFormField("complement", mainAddress?.complement || "");
		useSuppliersEdit.setFormField("city", mainAddress?.city || "");
		useSuppliersEdit.setFormField("zip_code", mainAddress?.zip_code || "");
		useSuppliersEdit.setFormField("country", mainAddress?.country || "");

		const document = ref(useMaskDocument(supplier?.document || ""));
		const telephone = ref(String(mainContact?.telephone || ""));
		const cellphone = ref(String(mainContact?.cellphone || ""));
		const zipCode = ref(useMaskZipCode(mainAddress?.zip_code || ""));

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function onInputDocument(value: string) {
			document.value = useMaskDocument(value);
			useSuppliersEdit.setFormField("document", value.replace(/\D/g, ""));
		}

		function onInputTelephone(value: string) {
			let digits = value.replace(/\D/g, "");
			digits = digits.slice(0, 11);
			telephone.value = digits;
			useSuppliersEdit.setFormField("telephone", digits);
		}

		function onInputCellphone(value: string) {
			let digits = value.replace(/\D/g, "");
			digits = digits.slice(0, 11);
			cellphone.value = digits;
			useSuppliersEdit.setFormField("cellphone", digits);
		}

		async function onInputZipCode(value: string) {
			zipCode.value = useMaskZipCode(value);
			const digits = value.replace(/\D/g, "");
			useSuppliersEdit.setFormField("zip_code", digits);

			if (digits.length === 8) {
				const data = await fetchAddress(digits);
				// ignore stale responses if user changed the CEP meanwhile
				if (useSuppliersEdit.form.zip_code.value !== digits) return;
				if (data) {
					useSuppliersEdit.setFormField("street", data.street);
					useSuppliersEdit.setFormField("district", data.district);
					useSuppliersEdit.setFormField("city", data.city);

					const ufOpt = UFEnum.find(
						(o) =>
							(o as any).id === data.state || (o as any).text === data.state,
					);
					if (ufOpt) {
						useSuppliersEdit.setFormField("state", (ufOpt as any).id);
					} else {
						useSuppliersEdit.setFormField("state", data.state);
					}
				}
			}
		}

		function openConfirm() {
			showConfirm.value = true;
		}

		function onSuccess() {
			showSuccess.value = true;
		}

		async function confirmUpdate() {
			if (useSuppliersEdit.isLoading) {
				return;
			}

			await useSuppliersEdit.update(id);

			if (useSuppliersEdit.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}

		function continueFeedback() {
			showSuccess.value = false;
			useSuppliersEdit.resetForm();

			const router = useRouter();
			router.push({ name: "suppliers-list" });
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
			optionsUFEnum,
			showConfirm,
			showSuccess,
			useSuppliersEdit,
			document,
			telephone,
			cellphone,
			zipCode,
			form,
			footer,
			openConfirm,
			onSuccess,
			confirmUpdate,
			continueFeedback,
			onInputDocument,
			onInputTelephone,
			onInputCellphone,
			onInputZipCode,
		};
	},
});
</script>
<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar a atualização do fornecedor?"
		description="Após confirmação, você irá visualizá-lo no painel"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmUpdate"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Fornecedor atualizado com sucesso"
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
								@on-input="useSuppliersEdit.setFormField('legal_name', $event)"
							/>
							<MoleculesInputCommon
								label="Nome Fantasia"
								max-width="50%"
								:value="form.business_name.value as string"
								:message-error="form.business_name.errorMessages.join(', ')"
								@on-input="
									useSuppliersEdit.setFormField('business_name', $event)
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
									useSuppliersEdit.setFormField(
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
									useSuppliersEdit.setFormField('state_registration', $event)
								"
							/>
							<MoleculesInputCommon
								label="Representante"
								max-width="50%"
								:value="form.representative.value as string"
								:message-error="form.representative.errorMessages.join(', ')"
								@on-input="
									useSuppliersEdit.setFormField('representative', $event)
								"
							/>
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
						@on-input="useSuppliersEdit.setFormField('email', $event)"
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
						@on-input="useSuppliersEdit.setFormField('street', $event)"
					/>
					<MoleculesInputCommon
						label="Número"
						type-input="number"
						max-width="25%"
						:value="form.number.value as string"
						:message-error="form.number.errorMessages.join(', ')"
						@on-input="useSuppliersEdit.setFormField('number', $event)"
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
						@on-input="useSuppliersEdit.setFormField('district', $event)"
					/>
					<MoleculesInputCommon
						label="Cidade"
						max-width="25%"
						:value="form.city.value as string"
						:message-error="form.city.errorMessages.join(', ')"
						@on-input="useSuppliersEdit.setFormField('city', $event)"
					/>
					<MoleculesSelectsSimple
						label="Estado"
						max-width="25%"
						:value="form.state.value as string"
						:options="optionsUFEnum"
						:message-error="form.state.errorMessages.join(', ')"
						@item-selected="useSuppliersEdit.setFormField('state', $event.id)"
					/>
					<MoleculesInputCommon
						label="Complemento"
						max-width="25%"
						:value="form.complement.value as string"
						:message-error="form.complement.errorMessages.join(', ')"
						@on-input="useSuppliersEdit.setFormField('complement', $event)"
					/>
					<MoleculesInputCommon
						label="País"
						max-width="25%"
						:value="form.country.value as string"
						:message-error="form.country.errorMessages.join(', ')"
						@on-input="useSuppliersEdit.setFormField('country', $event)"
					/>
				</div>
			</div>
		</section>
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
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";

.header__container--item {
	position: relative;
	cursor: pointer;
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
