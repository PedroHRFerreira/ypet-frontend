<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCreateStore } from "~/stores/locations/useCreateStore";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsLocationsCreate",
	setup() {
		const store = useCreateStore();
		const router = useRouter();

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

		const onlyNumbers = (event: KeyboardEvent) => {
			const char = String.fromCharCode(event.which);
			if (!/[0-9]/.test(char)) event.preventDefault();
		};

		return {
			store,
			optionsTypeLocation,
			optionsStatus,
			handleInput,
			handleAddressInput,
			onlyNumbers,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmCreate,
			continueFeedback,
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
					:value="store.form.phone.value"
					:message-error="store.form.phone.errorMessages[0]"
					@on-input="(value) => handleInput('phone', value)"
					@keypress="onlyNumbers"
				/>
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
					:value="store.form.address_zipcode.value"
					:message-error="store.form.address_zipcode.errorMessages[0]"
					@on-input="(value) => handleAddressInput('zipcode', value)"
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
				<MoleculesInputCommon
					label="Estado"
					:value="store.form.address_state.value"
					:message-error="store.form.address_state.errorMessages[0]"
					@on-input="(value) => handleAddressInput('state', value)"
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
					:value="store.form.cnpj.value"
					:message-error="store.form.cnpj.errorMessages[0]"
					@on-input="(value) => handleInput('cnpj', value)"
					@keypress="onlyNumbers"
				/>
				<MoleculesInputCommon
					label="Conta bancária ou PIX"
					:value="store.form.bank_account_or_pix.value"
					:message-error="store.form.bank_account_or_pix.errorMessages[0]"
					@on-input="(value) => handleInput('bank_account_or_pix', value)"
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
