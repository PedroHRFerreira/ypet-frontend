<script lang="ts">
import { defineComponent } from "vue";
import { useCreateStore } from "~/stores/animals/useCreateStore";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useAnimalStatusEnumStore } from "~/stores/Enums/useAnimalStatusEnumStore";

export default defineComponent({
	name: "OrganismsAnimalsCreate",
	async setup() {
		const useAnimalsCreate = useCreateStore();
		const useAnimalSpeciesEnum = useAnimalSpeciesEnumStore();
		const useGenderEnum = useGenderEnumStore();
		const useAnimalStatusEnum = useAnimalStatusEnumStore();
		const { form } = useAnimalsCreate;

		const [optionsSpecies, optionsGender, optionsAnimalStatus] =
			await Promise.all([
				useAnimalSpeciesEnum.getOptions(),
				useGenderEnum.getOptions(),
				useAnimalStatusEnum.getOptions(),
			]);

		const optionsBoolean: IOption[] = [
			{ id: 1, text: "Sim", state: "default" },
			{ id: 0, text: "Não", state: "activated" },
		];

		const birthDate = ref("");

		const entryDate = ref("");

		const isCastrated = computed(() => {
			return form.castrated.value === 1;
		});

		return {
			optionsGender,
			optionsSpecies,
			optionsAnimalStatus,
			optionsBoolean,
			birthDate,
			entryDate,
			form,
			useAnimalsCreate,
			isCastrated,
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
				<MoleculesInputCommon
					label="Nome do animal"
					max-width="482px"
					:value="form.name.value as string"
					:message-error="form.name.errorMessages.join(', ')"
					@on-input="useAnimalsCreate.setFormField('name', $event)"
				/>
				<MoleculesSelectsSimple
					max-width="215px"
					label="Tipo de Pet"
					:options="optionsSpecies"
					:message-error="form.species.errorMessages.join(', ')"
					@item-selected="useAnimalsCreate.setFormField('species', $event)"
				/>
				<MoleculesSelectsSimple
					max-width="243px"
					label="Sexo"
					:options="optionsGender"
					:message-error="form.gender.errorMessages.join(', ')"
					@item-selected="useAnimalsCreate.setFormField('gender', $event)"
				/>
				<MoleculesInputCommon
					label="Peso"
					type-input="number"
					max-width="216px"
					:maxlength="2"
					:value="form.weight.value as string"
					:message-error="form.weight.errorMessages.join(', ')"
					@on-input="useAnimalsCreate.setFormField('weight', $event)"
				/>
				<MoleculesInputOptionGroup
					name="Castrado"
					label="Castrado"
					:options="optionsBoolean"
					:value="form.castrated.value ? form.castrated.value : 0"
					:message-error="form.castrated.errorMessages.join(', ')"
					@change-option="useAnimalsCreate.setFormField('castrated', $event.id)"
				/>
				<MoleculesInputDate
					v-model="birthDate"
					label="Data de nascimento"
					name="birth_date"
					placeholder="YYYY-MM-DD"
					min="1900-01-01"
					max="2025-12-31"
					width="216px"
					:required="true"
					:error-messages="form.birth_date.errorMessages"
				/>
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
						width="216px"
						:required="true"
						:error-messages="form.entry_date.errorMessages"
					/>
					<MoleculesSelectsSimple
						max-width="215px"
						label="Status"
						:options="optionsAnimalStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="useAnimalsCreate.setFormField('status', $event)"
					/>
					<MoleculesInputCommon
						label="Local do recolhimento"
						type-input="text"
						:value="form.collection_site.value as string"
						:message-error="form.collection_site.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('collection_site', $event)"
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
				</div>
				<div class="animal__input-data__content--group">
					<MoleculesInputCommon
						v-if="form.castrated.value"
						label="Local da castração"
						type-input="text"
						:value="form.castration_site.value as string"
						:message-error="form.castration_site.errorMessages.join(', ')"
						@on-input="useAnimalsCreate.setFormField('castration_site', $event)"
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
					@onclick="useAnimalsCreate.createAnimal()"
				/>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
