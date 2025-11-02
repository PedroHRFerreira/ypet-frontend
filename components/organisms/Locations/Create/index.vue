<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useZipcodeLookup } from "~/composables/useZipcodeLookup";
import { useMaskZipCode } from "~/composables/useMaskZipCode";
import { useRouter } from "vue-router";
import { useCreateStore } from "~/stores/locations/useCreateStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsLocationsCreate",
	setup() {
		const store = useCreateStore();
		const router = useRouter();
		const { fetchAddress } = useZipcodeLookup();

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const optionsTypeLocation = computed<IOption[]>(() => [
			{ id: "pet_hotel", text: "Hotel Pet" },
			{ id: "temporary_home", text: "Lar Temporário" },
			{
				id: "municipal_temporary_shelter",
				text: "Abrigo Temporário Municipal",
			},
			{ id: "partner_clinics", text: "Clínicas Conveniadas" },
			{ id: "veterinary_hospital", text: "Hospital Veterinário" },
			{ id: "adopt_here", text: "Adote Aqui" },
			{ id: "shelter_protector", text: "Abrigo / Protetor" },
		]);

		const optionsStatus = computed<IOption[]>(() => [
			{ id: 0, text: "Inativo" },
			{ id: 1, text: "Ativo" },
		]);

		const optionsState = computed<IOption[]>(() => [
			{ id: "AC", text: "Acre" },
			{ id: "AL", text: "Alagoas" },
			{ id: "AP", text: "Amapá" },
			{ id: "AM", text: "Amazonas" },
			{ id: "BA", text: "Bahia" },
			{ id: "CE", text: "Ceará" },
			{ id: "DF", text: "Distrito Federal" },
			{ id: "ES", text: "Espírito Santo" },
			{ id: "GO", text: "Goiás" },
			{ id: "MA", text: "Maranhão" },
			{ id: "MT", text: "Mato Grosso" },
			{ id: "MS", text: "Mato Grosso do Sul" },
			{ id: "MG", text: "Minas Gerais" },
			{ id: "PA", text: "Pará" },
			{ id: "PB", text: "Paraíba" },
			{ id: "PR", text: "Paraná" },
			{ id: "PE", text: "Pernambuco" },
			{ id: "PI", text: "Piauí" },
			{ id: "RJ", text: "Rio de Janeiro" },
			{ id: "RN", text: "Rio Grande do Norte" },
			{ id: "RS", text: "Rio Grande do Sul" },
			{ id: "RO", text: "Rondônia" },
			{ id: "RR", text: "Roraima" },
			{ id: "SC", text: "Santa Catarina" },
			{ id: "SP", text: "São Paulo" },
			{ id: "SE", text: "Sergipe" },
			{ id: "TO", text: "Tocantins" },
		]);

		const formValidate = (): boolean => {
			let valid = true;
			const requiredFields = [
				"location_name",
				"location_type",
				"responsible_name",
				"phone",
				"status",
			];

			requiredFields.forEach((field) => {
				const value = store.form[field]?.value;
				if (!value || (typeof value === "string" && value.trim() === "")) {
					store.setFormError(field, ["Campo obrigatório"]);
					valid = false;
				}
			});

			const addressRequiredFields = [
				"address_street",
				"address_number",
				"address_zipcode",
			];

			addressRequiredFields.forEach((field) => {
				const value = store.form[field]?.value;
				if (!value || (typeof value === "string" && value.trim() === "")) {
					store.setFormError(field, ["Campo obrigatório"]);
					valid = false;
				}
			});

			return valid;
		};

		function openConfirm() {
			if (formValidate()) showConfirm.value = true;
		}

		async function confirmCreate() {
			if (store.isLoading) return;

			await store.create();

			showConfirm.value = false;

			if (store.successMessage) showSuccess.value = true;
		}

		function continueFeedback() {
			showSuccess.value = false;
			store.resetForm();
			router.push({ name: "locations" });
		}

		const handleInput = (field: string, value: any) => {
			store.setFormField(field, value);
		};

		const handleAddressInput = (field: string, value: any) => {
			store.setFormField(`address_${field}`, value);
		};

		const onInputZipcode = async (value: string) => {
			const digits = value.replace(/\D/g, "");
			store.setFormField("address_zipcode", digits);
			if (digits.length === 8) {
				const data = await fetchAddress(digits);
				if (data) {
					store.setFormField("address_street", data.street);
					store.setFormField("address_district", data.district);
					store.setFormField("address_city", data.city);
					const ufOpt = optionsState.value.find(
						(o) =>
							(o as any).id === data.state || (o as any).text === data.state,
					);
					if (ufOpt) {
						store.setFormField("address_state", (ufOpt as any).id);
					}
				}
			}
		};

		const onlyNumbers = (event: KeyboardEvent) => {
			const char = String.fromCharCode(event.which);
			if (!/[0-9]/.test(char)) event.preventDefault();
		};

		const file = ref<File | null>(null);
		const errorMessage = ref("");

		function handleInputFile(payload: string | File) {
			if (payload instanceof File) {
				file.value = payload;
				store.setFormField("picture", payload);
			} else {
				// Para criar, sempre enviamos File; ignorar strings/base64
				console.log("Upload retornou string/base64, ignorado no create.");
			}
		}

		function handleChange(selectedFile: File) {
			// Alinhar ao comportamento da edição: sempre atualizar o campo 'picture'
			file.value = selectedFile;
			store.setFormField("picture", selectedFile);
		}

		function handleError(message: string) {
			errorMessage.value = message;
			// Limpa arquivo e registra erro no campo 'picture' (igual edição)
			file.value = null;
			store.setFormField("picture", null);
			store.setFormError("picture", [message]);
		}

		return {
			store,
			optionsTypeLocation,
			optionsStatus,
			handleInput,
			handleAddressInput,
			onInputZipcode,
			onlyNumbers,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmCreate,
			continueFeedback,
			optionsState,
			useMaskZipCode,
			handleInputFile,
			handleChange,
			handleError,
		};
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar o cadastro do local?"
		description="Após confirmação, você irá  visualizá-lo no painel"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmCreate"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Cadastro realizado com sucesso"
		description="Visualize os dados na área de locais."
		continue-text="Continuar"
		@continue="continueFeedback"
	/>

	<article class="wrapper">
		<section class="wrapper__about-location">
			<div class="wrapper__input-data__content">
				<div class="wrapper__input-data__content--group">
					<MoleculesUploadField
						label="Selecione um arquivo para enviar"
						description="Arquivo até 2mb"
						maxWidth="30%"
						:accept="'image/*'"
						:maxSize="2 * 1024 * 1024"
						:maxHeight="180"
						:value="store.form.picture.value as any"
						@input="handleInputFile"
						@change="handleChange"
						@error="handleError"
					/>
					<div class="wrapper__input-data__content">
						<div class="wrapper__about-location--group">
							<MoleculesInputCommon
								label="Nome"
								:value="store.form.location_name.value"
								:message-error="store.form.location_name.errorMessages[0]"
								@on-input="(value) => handleInput('location_name', value)"
							/>
							<MoleculesSelectsSimple
								label="Tipo de local"
								:options="optionsTypeLocation"
								:value="store.form.location_type.value"
								:message-error="store.form.location_type.errorMessages[0]"
								@item-selected="(opt) => handleInput('location_type', opt.id)"
							/>
						</div>

						<div class="wrapper__about-location--group">
							<MoleculesInputCommon
								label="Responsável"
								:value="store.form.responsible_name.value"
								:message-error="store.form.responsible_name.errorMessages[0]"
								@on-input="(value) => handleInput('responsible_name', value)"
							/>
							<MoleculesInputCommon
								label="Telefone"
								typeInput="text"
								:value="usePhoneFormatter11BR(store.form.phone.value)"
								:message-error="store.form.phone.errorMessages[0]"
								@on-input="
									(formattedValue) => {
										const onlyNumbers = formattedValue.replace(/\D/g, '');
										handleInput('phone', onlyNumbers);
									}
								"
								@keypress="onlyNumbers"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="wrapper__input-data__content">
				<div class="wrapper__about-location--group">
					<MoleculesInputCommon
						label="E-mail"
						max-width="50%"
						:value="store.form.email.value"
						:message-error="store.form.email.errorMessages[0]"
						@on-input="(value) => handleInput('email', value)"
					/>
					<MoleculesSelectsSimple
						label="Status"
						:options="optionsStatus"
						:value="store.form.status.value"
						:message-error="store.form.status.errorMessages[0]"
						@item-selected="(opt) => handleInput('status', opt.id)"
					/>
				</div>
			</div>
		</section>

		<section class="wrapper__address">
			<div class="wrapper__address--row">
				<MoleculesInputCommon
					label="CEP"
					typeInput="text"
					:max-length="9"
					:value="
						useMaskZipCode(String(store.form.address_zipcode.value || ''))
					"
					:message-error="store.form.address_zipcode.errorMessages[0]"
					@on-input="onInputZipcode"
					@keypress="onlyNumbers"
				/>
				<MoleculesInputCommon
					label="Rua"
					:value="store.form.address_street.value"
					:message-error="store.form.address_street.errorMessages[0]"
					@on-input="(value) => handleAddressInput('street', value)"
				/>
				<MoleculesInputCommon
					label="Número"
					typeInput="text"
					:value="store.form.address_number.value"
					:message-error="store.form.address_number.errorMessages[0]"
					@on-input="(value) => handleAddressInput('number', value)"
					@keypress="onlyNumbers"
				/>
			</div>

			<div class="wrapper__address--row">
				<MoleculesInputCommon
					label="Bairro"
					:value="store.form.address_district.value"
					:message-error="store.form.address_district.errorMessages[0]"
					@on-input="(value) => handleAddressInput('district', value)"
				/>
				<MoleculesInputCommon
					label="Cidade"
					:value="store.form.address_city.value"
					:message-error="store.form.address_city.errorMessages[0]"
					@on-input="(value) => handleAddressInput('city', value)"
				/>
				<MoleculesSelectsSimple
					label="Estado"
					:options="optionsState"
					:value="store.form.address_state.value"
					:message-error="store.form.location_type.errorMessages[0]"
					@item-selected="(opt) => handleAddressInput('state', opt.id)"
				/>
			</div>

			<div class="wrapper__address--row">
				<MoleculesInputCommon
					label="Complemento"
					:value="store.form.address_complement.value"
					:message-error="store.form.address_complement.errorMessages[0]"
					@on-input="(value) => handleAddressInput('complement', value)"
				/>
			</div>

			<div class="wrapper__address--row">
				<MoleculesInputCommon
					label="CNPJ"
					typeInput="text"
					:value="useMaskDocument(store.form.cnpj.value)"
					:message-error="store.form.cnpj.errorMessages[0]"
					@on-input="(value) => handleInput('cnpj', value)"
					@keypress="onlyNumbers"
				/>
				<MoleculesInputCommon
					label="Observações"
					:value="store.form.notes.value"
					:message-error="store.form.notes.errorMessages[0]"
					@on-input="(value) => handleInput('notes', value)"
				/>
			</div>
		</section>

		<div class="wrapper__address--footer">
			<MoleculesButtonsCommon
				class="save"
				type="primary"
				text="Cadastrar"
				icon-right
				nameIconRight="plus"
				size="medium"
				:state="store.isLoading ? 'loading' : 'default'"
				@click="openConfirm"
			/>
		</div>
	</article>
</template>

<style scoped lang="scss">
@import "styles.module";
</style>
