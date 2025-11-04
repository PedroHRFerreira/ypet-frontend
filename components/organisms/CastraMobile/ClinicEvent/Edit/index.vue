<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useMobileEventStatusEnumStore } from "~/stores/Enums/useMobileEventStatusEnumStore";
import { useEditStore } from "~/stores/castra-mobile/clinic-events/useEditStore";
import { useDetailStore } from "~/stores/castra-mobile/clinic-events/useDetailStore";
import { useLocationsStore } from "~/stores/locations/useListStore";

export default defineComponent({
	name: "OrganismsClinicEventEdit",
	setup() {
		const editStore = useEditStore();
		const detailsStore = useDetailStore();
		const locationsStore = useLocationsStore();
		const { form } = editStore;
		const id = useRoute().params.id as string;

		const species = ref<IOption[]>([]);
		const gender = ref<IOption[]>([]);
		const status = ref<IOption[]>([]);

		onMounted(async () => {
			[species.value, gender.value, status.value] = await Promise.all([
				useAnimalSpeciesEnumStore().getOptions(),
				useGenderEnumStore().getOptions(),
				useMobileEventStatusEnumStore().getOptions(),
			]);

			await detailsStore.fetchById(id, { "with[]": ["rules"] });
			await locationsStore.fetchLocations();

			editStore.setFormField("name", detailsStore.data.name);
			editStore.setFormField("description", detailsStore.data.description);
			editStore.setFormField("start_date", detailsStore.data.start_date);
			editStore.setFormField("end_date", detailsStore.data.end_date);
			editStore.setFormField("location_id", detailsStore.data.location_id);
			editStore.setFormField(
				"max_registrations",
				detailsStore.data.max_registrations,
			);
			if (!editStore.rules?.value || editStore.rules.value.length === 0) {
				editStore.setFormField(
					"rules",
					detailsStore.data.rules.map((rule) => ({
						id: rule.id,
						max_registrations: rule.max_registrations,
					})),
				);
			}
		});

		const optionsSpecies = computed(() => {
			const data = detailsStore.data;

			return species.value.map((item) => {
				if (item.id === data.species?.value) {
					item.state = "activated";
					editStore.setFormField("species", item.id);
				}

				return item;
			});
		});

		const optionsGender = computed(() => {
			const data = detailsStore.data;

			return gender.value.map((item) => {
				if (item.id === data.gender?.value) {
					item.state = "activated";
					editStore.setFormField("gender", item.id);
				}

				return item;
			});
		});

		const optionsStatus = computed(() => {
			const data = detailsStore.data;

			return status.value.map((item) => {
				if (item.id === data.status?.value) {
					item.state = "activated";
					editStore.setFormField("status", item.id);
				}

				return item;
			});
		});

		const optionsLocations = computed(() => {
			const data = detailsStore.data;

			return locationsStore.locations.map((location) => {
				const option: IOption = {
					id: location.id,
					text: location.location_name,
					state: "default" as "default" | "activated" | "disabled",
				};

				if (location.id === data.location_id) {
					option.state = "activated";
				}

				return option;
			});
		});

		const startDate = ref(detailsStore.data.start_date || "");
		const endDate = ref(detailsStore.data.end_date || "");
		const showConfirm = ref(false);
		const showSuccess = ref(false);

		const modalFeedback = {
			confirm: {
				title: "Deseja confirmar a atualização?",
				description: "Após confirmação, você irá visualizá-lo no painel",
				confirmText: "Confirmar",
				cancelText: "Cancelar",
				action: async () => {
					if (editStore.isLoading) {
						return;
					}

					const id = useRoute().params.id as string;
					await editStore.update(id);

					if (editStore.successMessage) {
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
				},
			},
		};

		const header = {
			title: {
				label: "Editar evento clínico",
				type: "text-p2",
				weight: "medium",
				color: "var(--brand-color-dark-blue-900)",
			},
			titleSecond: {
				label: "Regras do evento",
				type: "text-p2",
				weight: "medium",
				color: "var(--brand-color-dark-blue-900)",
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

		const changeMaxRegistrations = (ruleId: number, newValue: number) => {
			const currentRules = form.rules.value;

			const updatedRules = currentRules.map((rule) =>
				rule.id === ruleId
					? { ...rule, max_registrations: Number(newValue) }
					: rule,
			);

			editStore.setFormField("rules", updatedRules);
			console.log(updatedRules);
		};

		return {
			useDayjs,
			optionsGender,
			optionsSpecies,
			optionsStatus,
			optionsLocations,
			endDate,
			startDate,
			form,
			editStore,
			modalFeedback,
			footer,
			header,
			showSuccess,
			showConfirm,
			changeMaxRegistrations,
		};
	},
	watch: {
		endDate: {
			handler(newValue) {
				this.editStore.setFormField("end_date", newValue);
			},
			deep: true,
		},
		startDate: {
			handler(newValue) {
				this.editStore.setFormField("start_date", newValue);
			},
			deep: true,
		},
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		key="confirmEditClinicEvent"
		v-model:open="showConfirm"
		variant="confirm"
		:title="modalFeedback.confirm.title"
		:description="modalFeedback.confirm.description"
		:confirm-text="modalFeedback.confirm.confirmText"
		:cancel-text="modalFeedback.confirm.cancelText"
		@confirm="modalFeedback.confirm.action()"
	/>
	<MoleculesConfirmFeedbackModal
		key="successEditClinicEvent"
		v-model:open="showSuccess"
		variant="success"
		:title="modalFeedback.success.title"
		:description="modalFeedback.success.description"
		:continue-text="modalFeedback.success.continueText"
		@continue="modalFeedback.success.action()"
	/>
	<div class="settings-create">
		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.title.type"
					:text="header.title.label"
					:weight="header.title.weight"
					:color="header.title.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome"
						max-width="35%"
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="editStore.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="Descrição"
						max-width="65%"
						:value="form.description.value as string"
						:message-error="form.description.errorMessages.join(', ')"
						@on-input="editStore.setFormField('description', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="30%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="editStore.setFormField('status', $event)"
					/>
					<MoleculesInputDate
						v-model="startDate"
						label="Data de início"
						name="start_date"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.start_date.errorMessages"
					/>
					<MoleculesInputDate
						v-model="endDate"
						label="Data de término"
						name="end_date"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.end_date.errorMessages"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="100%"
						label="Local do evento"
						:options="optionsLocations"
						:value="form.location_id.value"
						:message-error="form.location_id.errorMessages.join(', ')"
						@item-selected="editStore.setFormField('location_id', $event)"
					/>
				</div>
			</div>
		</section>

		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					:type="header.titleSecond.type"
					:text="header.titleSecond.label"
					:weight="header.titleSecond.weight"
					:color="header.titleSecond.color"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Cão Macho"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="form.rules.value[0].max_registrations as string"
						@on-input="changeMaxRegistrations(form.rules.value[0].id, $event)"
					/>
					<MoleculesInputCommon
						label="Cão Fêmea"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="form.rules.value[1].max_registrations as string"
						@on-input="changeMaxRegistrations(form.rules.value[1].id, $event)"
					/>
				</div>

				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Gato Macho"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="form.rules.value[2].max_registrations as string"
						@on-input="changeMaxRegistrations(form.rules.value[2].id, $event)"
					/>
					<MoleculesInputCommon
						label="Gato Fêmea"
						type-input="number"
						max-width="50%"
						placeholder="Número máximo de vagas"
						:value="form.rules.value[3].max_registrations as string"
						@on-input="changeMaxRegistrations(form.rules.value[3].id, $event)"
					/>
				</div>
			</div>
			<div class="settings-create__about-pet__content--footer">
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
