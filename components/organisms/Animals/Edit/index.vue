<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useAnimalStatusEnumStore } from "~/stores/Enums/useAnimalStatusEnumStore";
import { useAnimalSizeEnumStore } from "~/stores/Enums/useAnimalSizeEnumStore";
import { useAnimalCoatEnumStore } from "~/stores/Enums/useAnimalCoatEnumStore";
import { useEditStore } from "~/stores/animals/useEditStore";
import { useDetailStore } from "~/stores/animals/useDetailStore";

export default defineComponent({
	name: "OrganismsAnimalsEdit",
	async setup() {
		const animalDetailsStore = useDetailStore();
		const useAnimalsEdit = useEditStore();
		const useAnimalSpeciesEnum = useAnimalSpeciesEnumStore();
		const useGenderEnum = useGenderEnumStore();
		const useAnimalStatusEnum = useAnimalStatusEnumStore();
		const useAnimalSizeEnum = useAnimalSizeEnumStore();
		const useAnimalCoatEnum = useAnimalCoatEnumStore();
		const { form } = useAnimalsEdit;
		const id = useRoute().params.id as string;

		const [species, gender, animalStatus, animalSize, animalCoat] =
			await Promise.all([
				useAnimalSpeciesEnum.getOptions(),
				useGenderEnum.getOptions(),
				useAnimalStatusEnum.getOptions(),
				useAnimalSizeEnum.getOptions(),
				useAnimalCoatEnum.getOptions(),
				animalDetailsStore.fetchAnimalById(id, {
					"with[]": ["status", "entryData"],
				}),
			]);

		const birthDate = ref(animalDetailsStore.animal.birth_date || "");
		const entryDate = ref(
			animalDetailsStore.animal.entry_data?.entry_date || "",
		);
		const animal = animalDetailsStore.animal;
		useAnimalsEdit.setFormField("name", animal.name);
		useAnimalsEdit.setFormField(
			"microchip_number",
			animal.entry_data?.microchip_number,
		);
		useAnimalsEdit.setFormField("entry_date", animal.entry_data?.entry_date);
		useAnimalsEdit.setFormField("weight", animal.weight);
		useAnimalsEdit.setFormField("color", animal.color);
		useAnimalsEdit.setFormField("characteristics", animal.characteristics);
		useAnimalsEdit.setFormField("surname", animal?.surname || "");
		useAnimalsEdit.setFormField(
			"registration_number",
			animal.entry_data?.registration_number,
		);
		useAnimalsEdit.setFormField("infirmity", animal.entry_data?.infirmity);
		useAnimalsEdit.setFormField(
			"castrated",
			animal.entry_data?.castrated ? 1 : 0,
		);
		useAnimalsEdit.setFormField(
			"dewormed",
			animal.entry_data?.dewormed ? 1 : 0,
		);

		const optionsAnimalCoat = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalCoat.map((item) => {
				if (item.id === animal?.coat?.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("coat", item.id);
				}

				return item;
			});
		});

		const optionsAnimalStatus = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalStatus.map((item) => {
				if (item.id === animal.status?.status.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("status", item.id);
				}

				return item;
			});
		});

		const optionsAnimalSize = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalSize.map((item) => {
				if (item.id === animal.size.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("size", item.id);
				}

				return item;
			});
		});

		const optionsSpecies = computed(() => {
			const animal = animalDetailsStore.animal;

			return species.map((item) => {
				if (item.id === animal.species.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("species", item.id);
				}

				return item;
			});
		});

		const optionsGender = computed(() => {
			const animal = animalDetailsStore.animal;

			return gender.map((item) => {
				if (item.id === animal.gender.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("gender", item.id);
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

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
			confirm: {
				title: "Deseja confirmar a atualização no animal?",
				description: "Após confirmação, você irá visualizá-lo no painel",
				confirmText: "Confirmar",
				cancelText: "Cancelar",
				action: async () => {
					if (useAnimalsEdit.isLoading) {
						return;
					}

					const id = useRoute().params.id as string;
					await useAnimalsEdit.update(id);

					if (useAnimalsEdit.successMessage) {
						showSuccess.value = true;
					}

					showConfirm.value = false;
				},
			},
			success: {
				show: false,
				title: "Atualizado com sucesso",
				description: "Visualize os dados na área de edição.",
				continueText: "Continuar",
				action: () => {
					showSuccess.value = false;
					const router = useRouter();
					router.back();
				},
			},
		};

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
			optionsGender,
			optionsSpecies,
			optionsAnimalStatus,
			optionsAnimalSize,
			optionsAnimalCoat,
			optionsBoolean,
			birthDate,
			entryDate,
			form,
			useAnimalsEdit,
			showConfirm,
			showSuccess,
			animalDetailsStore,
			footer,
			modalFeedback,
		};
	},
	watch: {
		birthDate: {
			handler(newValue) {
				this.useAnimalsEdit.setFormField("birth_date", newValue);
			},
			deep: true,
		},
		entryDate: {
			handler(newValue) {
				this.useAnimalsEdit.setFormField("entry_date", newValue);
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
		:title="modalFeedback.confirm.title"
		:description="modalFeedback.confirm.description"
		:confirm-text="modalFeedback.confirm.confirmText"
		:cancel-text="modalFeedback.confirm.cancelText"
		@confirm="modalFeedback.confirm.action()"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
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
						@on-input="useAnimalsEdit.setFormField('name', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Tipo de Pet"
						:options="optionsSpecies"
						:message-error="form.species.errorMessages.join(', ')"
						@item-selected="useAnimalsEdit.setFormField('species', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Sexo"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="useAnimalsEdit.setFormField('gender', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="25%"
						label="Porte"
						:options="optionsAnimalSize"
						:message-error="form.size.errorMessages.join(', ')"
						@item-selected="useAnimalsEdit.setFormField('size', $event)"
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
						@on-input="useAnimalsEdit.setFormField('weight', $event)"
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
						@item-selected="useAnimalsEdit.setFormField('coat', $event)"
					/>
					<MoleculesInputCommon
						label="Cor"
						type-input="text"
						max-width="25%"
						:value="form.color.value as string"
						:message-error="form.color.errorMessages.join(', ')"
						@on-input="useAnimalsEdit.setFormField('color', $event)"
					/>
				</div>
				<div class="animal__about-pet__content--group">
					<MoleculesInputCommon
						label="Características"
						type-input="text"
						max-width="50%"
						:value="form.characteristics.value as string"
						:message-error="form.characteristics.errorMessages.join(', ')"
						@on-input="useAnimalsEdit.setFormField('characteristics', $event)"
					/>
					<MoleculesInputCommon
						label="Apelido"
						type-input="text"
						max-width="50%"
						:value="form.surname.value as string"
						:message-error="form.surname.errorMessages.join(', ')"
						@on-input="useAnimalsEdit.setFormField('surname', $event)"
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
						@item-selected="useAnimalsEdit.setFormField('status', $event)"
					/>
					<MoleculesInputOptionGroup
						name="Castrado"
						label="Castrado"
						max-width="20%"
						:options="optionsBoolean"
						:value="form.castrated.value ? form.castrated.value : 0"
						:message-error="form.castrated.errorMessages.join(', ')"
						@change-option="useAnimalsEdit.setFormField('castrated', $event.id)"
					/>
					<MoleculesInputOptionGroup
						name="Vermifugado"
						label="Vermifugado"
						max-width="20%"
						:options="optionsBoolean"
						:value="form.dewormed.value ? form.dewormed.value : 0"
						:message-error="form.dewormed.errorMessages.join(', ')"
						@change-option="useAnimalsEdit.setFormField('dewormed', $event.id)"
					/>
				</div>
				<div class="animal__input-data__content--group">
					<MoleculesInputCommon
						label="Número da inscrição"
						type-input="number"
						:value="form.registration_number.value as string"
						:message-error="form.registration_number.errorMessages.join(', ')"
						@on-input="
							useAnimalsEdit.setFormField('registration_number', $event)
						"
					/>
					<MoleculesInputCommon
						label="Número do microchip"
						type-input="number"
						:value="form.microchip_number.value as string"
						:message-error="form.microchip_number.errorMessages.join(', ')"
						@on-input="useAnimalsEdit.setFormField('microchip_number', $event)"
					/>
					<MoleculesInputCommon
						label="Possui doença?"
						type-input="text"
						max-width="65%"
						:value="form.infirmity.value as string"
						:message-error="form.infirmity.errorMessages.join(', ')"
						@on-input="useAnimalsEdit.setFormField('infirmity', $event)"
					/>
				</div>
			</div>
			<div class="animal__input-data__footer">
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
</style>
