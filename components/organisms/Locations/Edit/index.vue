<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useZipcodeLookup } from "~/composables/useZipcodeLookup";
import { useMaskZipCode } from "~/composables/useMaskZipCode";
import { useRoute, useRouter } from "vue-router";
import { useEditStore } from "~/stores/locations/useEditStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsLocationsEdit",
	setup() {
		const store = useEditStore();
		const router = useRouter();
		const route = useRoute();

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

		const optionsStatus = computed<IOption[]>(() => [
			{ id: 0, text: "Inativo" },
			{ id: 1, text: "Ativo" },
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

		async function confirmUpdate() {
			if (store.isLoading) return;

			const id = route.params.id as string;
			await store.update(id);

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

		const { fetchAddress } = useZipcodeLookup();
		async function onInputZipcode(value: string) {
			const digits = value.replace(/\D/g, "");
			store.setFormField("address_zipcode", digits);
			if (digits.length === 8) {
				const data = await fetchAddress(digits);
				if (data) {
					store.setFormField("address_street", data.street);
					store.setFormField("address_neighborhood", data.district);
					store.setFormField("address_city", data.city);
					store.setFormField("address_complement", data.complement || "");
					const ufOpt = optionsState.value.find(
						(o) =>
							(o as any).id === data.state || (o as any).text === data.state,
					);
					if (ufOpt) {
						store.setFormField("address_state", (ufOpt as any).id);
					}
				}
			}
		}

		const onlyNumbers = (event: KeyboardEvent) => {
			const char = String.fromCharCode(event.which);
			if (!/[0-9]/.test(char)) event.preventDefault();
		};

		onMounted(async () => {
			const id = route.params.id as string;
			await store.fetchLocation(id);
		});

		function handleImageUpload(file: File | null) {
			store.setFormField("picture", file);
		}

		function handleChange(file: File) {
			store.setFormField("picture", file);
		}

		function handleError(error: string) {
			store.setFormField("picture", null);
			store.setFormError("picture", [error]);
		}

		const initialPicture = computed(() => {
			const current = store.form.picture.value as any;
			if (current) return current;
		});

		return {
			optionsState,
			store,
			optionsTypeLocation,
			optionsStatus,
			handleInput,
			handleAddressInput,
			onlyNumbers,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmUpdate,
			continueFeedback,
			useMaskZipCode,
			onInputZipcode,
			handleImageUpload,
			handleChange,
			handleError,
			initialPicture,
		};
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Deseja confirmar a edição do local?"
		description="Após confirmação, as alterações serão salvas."
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmUpdate"
	/>

	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Edição realizada com sucesso"
		description="As informações foram atualizadas corretamente."
		continue-text="Continuar"
		@continue="continueFeedback"
	/>

	<article class="wrapper">
		<section class="wrapper__about-location">
			<div class="wrapper__input-data__content">
				<div class="wrapper__about-location--group">
					<MoleculesUploadField
						label="Selecione um arquivo para enviar"
						description="Arquivo até 2mb"
						maxWidth="40%"
						:value="initialPicture"
						:accept="'image/*'"
						:maxSize="2 * 1024 * 1024"
						:maxHeight="180"
						@input="handleImageUpload($event)"
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
								:value="usePhoneFormatter11BR(String(store.form.phone.value))"
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

			<div class="wrapper__about-location--group">
				<MoleculesInputCommon
					label="E-mail"
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
		</section>

		<section class="wrapper__address">
			<div class="wrapper__address--row">
				<MoleculesInputCommon
					label="CEP"
					typeInput="text"
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
					:value="store.form.address_neighborhood.value"
					:message-error="store.form.address_neighborhood.errorMessages[0]"
					@on-input="(value) => handleAddressInput('neighborhood', value)"
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
				text="Salvar"
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
