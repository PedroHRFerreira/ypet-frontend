<script lang="ts">
import { defineComponent } from "vue";
import { useCreateStore } from "~/stores/animals/useCreateStore";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useAnimalStatusEnumStore } from "~/stores/Enums/useAnimalStatusEnumStore";
import { useAnimalSizeEnumStore } from "~/stores/Enums/useAnimalSizeEnumStore";
import { useAnimalCoatEnumStore } from "~/stores/Enums/useAnimalCoatEnumStore";

export default defineComponent({
	name: "OrganismsAnimalsCreate",
	async setup() {
		const useAnimalsCreate = useCreateStore();
		const useAnimalSpeciesEnum = useAnimalSpeciesEnumStore();
		const useGenderEnum = useGenderEnumStore();
		const useAnimalStatusEnum = useAnimalStatusEnumStore();
		const useAnimalSizeEnum = useAnimalSizeEnumStore();
		const useAnimalCoatEnum = useAnimalCoatEnumStore();
		const { form } = useAnimalsCreate;

		const [
			optionsSpecies,
			optionsGender,
			optionsAnimalStatus,
			optionsAnimalSize,
			optionsAnimalCoat,
		] = await Promise.all([
			useAnimalSpeciesEnum.getOptions(),
			useGenderEnum.getOptions(),
			useAnimalStatusEnum.getOptions(),
			useAnimalSizeEnum.getOptions(),
			useAnimalCoatEnum.getOptions(),
		]);

		const optionsBoolean: IOption[] = [
			{ id: 1, text: "Sim", state: "default" },
			{ id: 0, text: "Não", state: "default" },
		];

		const birthDate = ref("");

		const entryDate = ref("");

		const isCastrated = computed(() => {
			return form.castrated.value === 1;
		});

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function openConfirm() {
			showConfirm.value = true;
		}
		async function confirmCreate() {
			if (useAnimalsCreate.isLoading) {
				return;
			}

			await useAnimalsCreate.createAnimal();

			if (useAnimalsCreate.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}
		function onSuccess() {
			showSuccess.value = true;
		}
		function continueFeedback() {
			showSuccess.value = false;
			useAnimalsCreate.resetForm();

			const router = useRouter();
			router.push({ name: "animals-list" });
		}

		return {
			optionsGender,
			optionsSpecies,
			optionsAnimalStatus,
			optionsAnimalSize,
			optionsAnimalCoat,
			optionsBoolean,
			birthDate,
			entryDate,
			form,
			useAnimalsCreate,
			isCastrated,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmCreate,
			continueFeedback,
		};
	},
	watch: {
		birthDate: {
			handler(newValue) {
				this.useAnimalsCreate.setFormField("birth_date", newValue);
			},
			deep: true,
		},
		entryDate: {
			handler(newValue) {
				this.useAnimalsCreate.setFormField("entry_date", newValue);
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
	<div class="animal">
		<section class="animal__about-pet">
			<div class="animal__about-pet__header">
				<AtomsTypography
					type="text-p2"
					text="Sobre o pet"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="animal__about-pet__content">
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome do animal"
						max-width="25%"
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('name', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Tipo de Pet"
						:options="optionsSpecies"
						:message-error="form.species.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('species', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Sexo"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('gender', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Porte"
						:options="optionsAnimalSize"
						:message-error="form.size.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('size', $event)"
					/>
				</div>
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Peso"
						type-input="number"
						max-width="25%"
						:maxlength="2"
						:value="form.weight.value as string"
						:message-error="form.weight.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('weight', $event)"
					/>
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
					<MoleculesSelectsSimple
						max-width="25%"
						label="Pelagem"
						:options="optionsAnimalCoat"
						:message-error="form.coat.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('coat', $event)"
					/>
					<MoleculesInputCommon
						label="Cor"
						type-input="text"
						max-width="25%"
						:value="form.color.value as string"
						:message-error="form.color.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('color', $event)"
					/>
				</div>
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Características"
						type-input="text"
						max-width="50%"
						:value="form.characteristics.value as string"
						:message-error="form.characteristics.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('characteristics', $event)"
					/>
					<MoleculesInputCommon
						label="Apelido"
						type-input="text"
						max-width="50%"
						:value="form.suname.value as string"
						:message-error="form.suname.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('suname', $event)"
					/>
				</div>
			</div>
		</section>
		<section class="animal__input-data">
			<div class="animal__input-data-header">
				<AtomsTypography
					type="text-p2"
					text="Dados de entrada"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="animal__input-data__content">
				<div class="animal__input-data__content--group">
					<MoleculesInputDate
						v-model="entryDate"
						label="Data de entrada"
						name="entry_date"
						placeholder="YYYY-MM-DD"
						min="1900-01-01"
						max="2025-12-31"
						width="30%"
						:required="true"
						:error-messages="form.entry_date.errorMessages"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="Status"
						:options="optionsAnimalStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('status', $event)"
					/>
					<MoleculesInputOptionGroup
						name="Castrado"
						label="Castrado"
						max-width="20%"
						:options="optionsBoolean"
						:value="form.castrated.value ? form.castrated.value : null"
						:message-error="form.castrated.errorMessages.join(', ')"
						@change-option="
							useAnimalsCreate.setFormField('castrated', $event.id)
						"
					/>
					<MoleculesInputOptionGroup
						name="Vermifugado"
						label="Vermifugado"
						max-width="20%"
						:options="optionsBoolean"
						:value="form.dewormed.value ? form.dewormed.value : null"
						:message-error="form.dewormed.errorMessages.join(', ')"
						@change-option="
							useAnimalsCreate.setFormField('dewormed', $event.id)
						"
					/>
				</div>
				<div class="animal__input-data__content--group">
					<MoleculesInputCommon
						label="Número da inscrição"
						type-input="number"
						:value="form.registration_number.value as string"
						:message-error="form.registration_number.errorMessages.join(', ')"
						@on-input="
							useAnimalsCreate.setFormField('registration_number', $event)
						"
					/>
					<MoleculesInputCommon
						label="Número do microchip"
						type-input="number"
						:value="form.microchip_number.value as string"
						:message-error="form.microchip_number.errorMessages.join(', ')"
						@on-input="
							useAnimalsCreate.setFormField('microchip_number', $event)
						"
					/>
					<MoleculesInputCommon
						label="Possui doença?"
						type-input="text"
						max-width="65%"
						:value="form.infirmity.value as string"
						:message-error="form.infirmity.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('infirmity', $event)"
					/>
				</div>
			</div>
			<div class="animal__input-data__footer">
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
</style>
