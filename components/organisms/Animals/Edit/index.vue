<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useAnimalStatusEnumStore } from "~/stores/Enums/useAnimalStatusEnumStore";
import { useAnimalSizeEnumStore } from "~/stores/Enums/useAnimalSizeEnumStore";
import { useAnimalCoatEnumStore } from "~/stores/Enums/useAnimalCoatEnumStore";
import { useEditStore } from "~/stores/animals/useEditStore";
import { useDetailStore } from "~/stores/animals/useDetailStore";
import { useLocationsStore } from "~/stores/locations/useListStore";

export default defineComponent({
	name: "OrganismsAnimalsEdit",
	setup() {
		const animalDetailsStore = useDetailStore();
		const useAnimalsEdit = useEditStore();
		const useAnimalSpeciesEnum = useAnimalSpeciesEnumStore();
		const useGenderEnum = useGenderEnumStore();
		const useAnimalStatusEnum = useAnimalStatusEnumStore();
		const useAnimalSizeEnum = useAnimalSizeEnumStore();
		const useAnimalCoatEnum = useAnimalCoatEnumStore();
		const locationsStore = useLocationsStore();
		const { form } = useAnimalsEdit;
		const id = useRoute().params.id as string;

		const species = ref<IOption[]>([]);
		const gender = ref<IOption[]>([]);
		const animalStatus = ref<IOption[]>([]);
		const animalSize = ref<IOption[]>([]);
		const animalCoat = ref<IOption[]>([]);

		const birthDate = ref("");
		const entryDate = ref("");

		const optionsAnimalCoat = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalCoat.value.map((item) => {
				if (item.id === animal?.coat?.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("coat", item.id);
				}

				return item;
			});
		});

		const optionsAnimalStatus = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalStatus.value.map((item) => {
				if (item.id === animal.status?.status.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("status", item.id);
				}

				return item;
			});
		});

		const optionsAnimalSize = computed(() => {
			const animal = animalDetailsStore.animal;

			return animalSize.value.map((item) => {
				if (item.id === animal.size.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("size", item.id);
				}

				return item;
			});
		});

		const optionsSpecies = computed(() => {
			const animal = animalDetailsStore.animal;

			return species.value.map((item) => {
				if (item.id === animal.species.value) {
					item.state = "activated";
					useAnimalsEdit.setFormField("species", item.id);
				}

				return item;
			});
		});

		const optionsGender = computed(() => {
			const animal = animalDetailsStore.animal;

			return gender.value.map((item) => {
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

		const optionsLocations = computed(() => {
			const animal = animalDetailsStore.animal;

			return locationsStore.locations.map((location) => {
				const option: IOption = {
					id: location.id,
					text: location.location_name,
					state: "default" as "default" | "activated" | "disabled",
				};

				if (location.id === animal.location_id) {
					option.state = "activated";
				}

				return option;
			});
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

		function handleImageUpload(file: File | null) {
			useAnimalsEdit.setFormField("picture", file);
		}

		onMounted(async () => {
			const [
				speciesData,
				genderData,
				animalStatusData,
				animalSizeData,
				animalCoatData,
			] = await Promise.all([
				useAnimalSpeciesEnum.getOptions(),
				useGenderEnum.getOptions(),
				useAnimalStatusEnum.getOptions(),
				useAnimalSizeEnum.getOptions(),
				useAnimalCoatEnum.getOptions(),
				animalDetailsStore.fetchAnimalById(id, {
					"with[]": ["status", "entryData", "location"],
				}),
				locationsStore.fetchLocations(),
			]);

			species.value = speciesData;
			gender.value = genderData;
			animalStatus.value = animalStatusData;
			animalSize.value = animalSizeData;
			animalCoat.value = animalCoatData;

			birthDate.value = animalDetailsStore.animal.birth_date || "";
			entryDate.value = animalDetailsStore.animal.entry_data?.entry_date || "";

			const animal = animalDetailsStore.animal;
			useAnimalsEdit.setFormField("name", animal.name);
			const pictureUrl = animal.entry_data?.picture || animal.picture;
			useAnimalsEdit.setFormField("picture", pictureUrl);
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
			useAnimalsEdit.setFormField("location_id", animal.location_id);
		});

		return {
			optionsGender,
			optionsSpecies,
			optionsAnimalStatus,
			optionsAnimalSize,
			optionsAnimalCoat,
			optionsLocations,
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
			handleImageUpload,
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
					<MoleculesUploadField
						label="Selecione um arquivo para enviar"
						description="Arquivo até 2mb"
						maxWidth="40%"
						:value="form.picture.value"
						:accept="'image/*'"
						:maxSize="2 * 1024 * 1024"
						:maxHeight="188"
						:preview="true"
						@input="handleImageUpload($event)"
					/>
					<div class="animal__input-data__content">
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
					</div>
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
				<div class="animal__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="100%"
						label="Local"
						:options="optionsLocations"
						:value="form.location_id.value"
						:message-error="form.location_id.errorMessages.join(', ')"
						placeholder-text="Selecione um local (opcional)"
						@item-selected="useAnimalsEdit.setFormField('location_id', $event)"
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
