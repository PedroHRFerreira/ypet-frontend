<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useGenderEnumStore } from "~/stores/Enums/useGenderEnumStore";
import { useCreateStore } from "~/stores/castra-mobile/clinic-events/useCreateStore";
import { useMobileEventStatusEnumStore } from "~/stores/Enums/useMobileEventStatusEnumStore";

export default defineComponent({
	name: "OrganismsClinicEventCreate",
	async setup() {
		const createStore = useCreateStore();
		const useAnimalSpeciesEnum = useAnimalSpeciesEnumStore();
		const useGenderEnum = useGenderEnumStore();
		const useMobileEventStatusEnum = useMobileEventStatusEnumStore();
		const { form } = createStore;

		const [optionsSpecies, optionsGender, optionsStatus] = await Promise.all([
			useAnimalSpeciesEnum.getOptions(),
			useGenderEnum.getOptions(),
			useMobileEventStatusEnum.getOptions(),
		]);

		const endDate = ref("");

		const startDate = ref("");

		const isCastrated = computed(() => {
			return form.castrated.value === 1;
		});

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		function openConfirm() {
			showConfirm.value = true;
		}
		async function confirmCreate() {
			if (createStore.isLoading) {
				return;
			}

			await createStore.createAnimal();

			if (createStore.successMessage) {
				onSuccess();
			}

			showConfirm.value = false;
		}
		function onSuccess() {
			showSuccess.value = true;
		}
		function continueFeedback() {
			showSuccess.value = false;
			createStore.resetForm();

			const router = useRouter();
			router.push({ name: "animals-list" });
		}

		return {
			useDayjs,
			optionsGender,
			optionsSpecies,
			optionsStatus,
			endDate,
			startDate,
			form,
			createStore,
			isCastrated,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmCreate,
			continueFeedback,
		};
	},
	watch: {
		endDate: {
			handler(newValue) {
				this.createStore.setFormField("end_date", newValue);
			},
			deep: true,
		},
		startDate: {
			handler(newValue) {
				this.createStore.setFormField("start_date", newValue);
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
	<div class="settings-create">
		<section class="settings-create__about-pet">
			<div class="settings-create__about-pet__header">
				<AtomsTypography
					type="text-p2"
					text="Sobre o pet"
					weight="medium"
					color="var(--brand-color-dark-blue-900)"
				/>
			</div>
			<div class="settings-create__about-pet__content">
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Nome"
						max-width="35%"
						:value="form.name.value as string"
						:message-error="form.name.errorMessages.join(', ')"
						@on-input="createStore.setFormField('name', $event)"
					/>
					<MoleculesInputCommon
						label="Descrição"
						max-width="65%"
						:value="form.description.value as string"
						:message-error="form.description.errorMessages.join(', ')"
						@on-input="createStore.setFormField('description', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesSelectsSimple
						max-width="35%"
						label="Tipo de Pet"
						:options="optionsSpecies"
						:message-error="form.species.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('species', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="35%"
						label="Sexo"
						:options="optionsGender"
						:message-error="form.gender.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('gender', $event)"
					/>
					<MoleculesSelectsSimple
						max-width="30%"
						label="Status"
						:options="optionsStatus"
						:message-error="form.status.errorMessages.join(', ')"
						@item-selected="createStore.setFormField('status', $event)"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Max. de vagas"
						type-input="number"
						max-width="30%"
						:maxlength="2"
						:value="form.max_registrations.value as string"
						:message-error="form.max_registrations.errorMessages.join(', ')"
						@on-input="createStore.setFormField('max_registrations', $event)"
					/>
					<MoleculesInputDate
						v-model="startDate"
						label="Data de início"
						name="start_date"
						placeholder="YYYY-MM-DD"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.start_date.errorMessages"
					/>
					<MoleculesInputDate
						v-model="endDate"
						label="Data de término"
						name="end_date"
						placeholder="YYYY-MM-DD"
						:min="useDayjs().format('YYYY-MM-DD')"
						width="35%"
						:required="true"
						:error-messages="form.end_date.errorMessages"
					/>
				</div>
				<div class="settings-create__about-pet__content--group">
					<MoleculesInputCommon
						label="Local do evento"
						max-width="100%"
						:value="form.location.value as string"
						:message-error="form.location.errorMessages.join(', ')"
						@on-input="createStore.setFormField('location', $event)"
					/>
				</div>

				<div class="settings-create__about-pet__content--footer">
					<MoleculesButtonsCommon
						type="primary"
						text="Cadastrar"
						width="128px"
						:icon-right="true"
						name-icon-right="plus"
						@onclick="openConfirm"
					/>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
