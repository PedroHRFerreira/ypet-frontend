<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useApplicationsCreateStore } from "~/stores/applications/useCreateStore";
import { useListStore as useAnimalsListStore } from "~/stores/animals/useListStore";
import { useListStore as useProductsListStore } from "~/stores/products/useListStore";
import { useDayjs } from "~/composables/useDayjs";
import type { IOption } from "~/types/global";

export default defineComponent({
	name: "OrganismsApplicationsCreate",
	setup() {
		const store = useApplicationsCreateStore();
		const animalsStore = useAnimalsListStore();
		const productsStore = useProductsListStore();

		const showConfirm = ref(false);
		const showSuccess = ref(false);

		// Definir selectedCategory antes dos computed que o utilizam
		const selectedCategory = ref<string>("vaccine");

		// Computed para o produto selecionado
		const selectedProduct = computed(() => {
			const productId = store.form.product_id.value as number;
			return productsStore.products?.find((p) => p.id === productId) || null;
		});

		// Computed para o animal selecionado
		const selectedAnimal = computed(() => {
			const animalId = store.form.animal_id.value as number;
			return animalsStore.animals?.find((a) => a.id === animalId) || null;
		});

		// Computed para o cálculo dinâmico do suprimento estimado
		const calculatedEstimatedSupply = computed(() => {
			const product = selectedProduct.value;
			const animal = selectedAnimal.value;

			if (!product || !animal || selectedCategory.value === "vaccine") {
				return "";
			}

			const standardQuantity = product.standard_quantity || 0;
			const referenceWeight = product.reference_weight || 0;
			const standardDays = product.standard_days || 0;
			const stock = product.stock || 0;
			const animalWeight = animal.weight || 0;

			// Validar se todos os campos necessários estão preenchidos
			if (
				standardQuantity <= 0 ||
				referenceWeight <= 0 ||
				standardDays <= 0 ||
				animalWeight <= 0 ||
				stock <= 0
			) {
				return "";
			}

			try {
				const consumoDiarioPorKg =
					standardQuantity / (referenceWeight * standardDays);

				const consumoDiarioAnimal = consumoDiarioPorKg * animalWeight;

				const estimatedDaysSupply = stock / consumoDiarioAnimal;

				return Math.round(estimatedDaysSupply);
			} catch (error) {
				console.error("Erro no cálculo do suprimento estimado:", error);
				return "";
			}
		});

		// Watch para atualizar o campo estimated_supply automaticamente
		watch(calculatedEstimatedSupply, (newValue) => {
			if (newValue !== "" && selectedCategory.value !== "vaccine") {
				store.setFormField("estimated_supply", newValue);
			}
		});

		// Watch para limpar o campo quando for vacina
		watch(selectedCategory, (newCategory) => {
			if (newCategory === "vaccine") {
				store.setFormField("estimated_supply", "");
			}
		});

		onMounted(async () => {
			await animalsStore.fetchAnimals({ without_pagination: true });
			await productsStore.fetchList({ without_pagination: true });
			// Preencher data atual no formato dd/mm/aaaa quando vazio
			if (!store.form.application_date.value) {
				store.setFormField("application_date", useDayjs().format("DD/MM/YYYY"));
			}
			// Garantir categoria inicial
			store.setFormField("category", selectedCategory.value);
		});

		const animalOptions = computed<IOption[]>(() => {
			return (animalsStore.animals || []).map((a) => ({
				id: a.id ?? "",
				text: `${a.id} - ${a.name}`,
				data: a,
			}));
		});

		const productOptions = computed<IOption[]>(() => {
			return (productsStore.products || []).map((p) => ({
				id: p.id ?? "",
				text: `${p.id} - ${p.name}`,
			}));
		});

		const routeOptions = computed<IOption[]>(() => [
			{ id: "subcutaneous", text: "Subcutânea" },
			{ id: "intramuscular", text: "Intramuscular" },
			{ id: "oral", text: "Oral" },
			{ id: "topical", text: "Tópica" },
		]);

		const adminViaOptions = computed<IOption[]>(() => [
			{ id: "oral", text: "Oral" },
			{ id: "Injectable", text: "Injetável" },
			{ id: "topical", text: "Tópica" },
		]);

		const frequencyOptions = computed<IOption[]>(() => [
			{ id: "1", text: "1x ao dia" },
			{ id: "2", text: "2x ao dia" },
			{ id: "3", text: "3x ao dia" },
			{ id: "4", text: "4x ao dia" },
		]);

		const periodDaysOptions = computed<IOption[]>(() => {
			return Array.from({ length: 30 }, (_, i) => ({
				id: String(i + 1),
				text: `${i + 1} dia${i + 1 > 1 ? "s" : ""}`,
			}));
		});

		// Opções de tipo de suplemento
		const supplementTypeOptions = computed<IOption[]>(() => [
			{ id: "vitaminic", text: "vitaminic" },
			{ id: "mineral", text: "mineral" },
			{ id: "proteic", text: "proteic" },
			{ id: "caloric_energetic", text: "caloric_energetic" },
			{ id: "immunologic", text: "immunologic" },
			{ id: "probiotic_digestive", text: "probiotic_digestive" },
			{ id: "articular", text: "articular" },
			{ id: "dermatologic_capillary", text: "dermatologic_capillary" },
		]);

		const categoryTabs = ref([
			{ id: "vaccine", name: "Vacinas", active: true },
			{ id: "vermifuge", name: "Vermifugação", active: false },
			{ id: "medication", name: "Medicação", active: false },
			{ id: "supplement", name: "Suplementação", active: false },
			{ id: "food", name: "Alimentação", active: false },
		] as ITab[]);

		function changeCategory(tab: ITab) {
			selectedCategory.value = String(tab.id);
			store.setFormField("category", selectedCategory.value);
		}

		function openConfirm() {
			showConfirm.value = true;
		}

		async function confirmCreate() {
			await store.create();
			showConfirm.value = false;
			if (store.successMessage) showSuccess.value = true;
		}

		function continueFeedback() {
			showSuccess.value = false;
			store.resetForm();
			// Reconfigurar categoria após reset
			store.setFormField("category", selectedCategory.value);
		}

		function applyDateMask(raw: string): string {
			const digits = String(raw || "")
				.replace(/\D/g, "")
				.slice(0, 8);
			const dd = digits.slice(0, 2);
			const mm = digits.slice(2, 4);
			const yyyy = digits.slice(4, 8);
			return [dd, mm, yyyy].filter(Boolean).join("/");
		}

		function onDateInput(field: string, raw: string) {
			const masked = applyDateMask(raw).slice(0, 10);
			store.setFormField(field, masked);
		}

		return {
			store,
			animalOptions,
			productOptions,
			routeOptions,
			adminViaOptions,
			frequencyOptions,
			periodDaysOptions,
			supplementTypeOptions,
			categoryTabs,
			selectedCategory,
			changeCategory,
			showConfirm,
			showSuccess,
			openConfirm,
			confirmCreate,
			continueFeedback,
			productsStore,
			onDateInput,
			calculatedEstimatedSupply,
		};
	},
});
</script>

<template>
	<MoleculesConfirmFeedbackModal
		v-model:open="showConfirm"
		variant="confirm"
		title="Confirmar aplicação?"
		description="Após confirmar, o registro será salvo."
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="confirmCreate"
	/>
	<MoleculesConfirmFeedbackModal
		v-model:open="showSuccess"
		variant="success"
		title="Aplicação registrada com sucesso"
		description="Você pode visualizar os dados na área de aplicações."
		continue-text="Continuar"
		@continue="continueFeedback"
	/>

	<div class="applications-form">
		<!-- Tabs de categorias -->
		<div class="applications-form__tabs">
			<MoleculesTabs :tabs="categoryTabs" @change-tab="changeCategory" />
		</div>

		<!-- Identificação do Animal -->
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Identificação do Animal"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="applications-form__group">
				<MoleculesSelectsSimple
					label="Animal"
					max-width="33%"
					:options="animalOptions"
					:value="store.form.animal_id.value as number"
					@item-selected="
						(opt) => {
							store.setFormField('animal_id', opt.id);
							store.setFormField(
								'animal_weight',
								Number(opt?.data?.weight ?? 0),
							);
						}
					"
				/>
				<MoleculesInputCommon
					label="Data da aplicação"
					max-width="33%"
					:maxlength="10"
					:value="store.form.application_date.value as string"
					@on-input="onDateInput('application_date', $event)"
				/>
			</div>
		</div>

		<!-- Produto e Suprimento -->
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Produto e Suprimento"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="applications-form__group">
				<MoleculesSelectsSimple
					label="Produto"
					max-width="50%"
					:options="productOptions"
					:value="store.form.product_id.value as number"
					@item-selected="
						(opt) => {
							store.setFormField('product_id', opt.id);
							store.setFormField('product_name', opt.text);
						}
					"
				/>
				<MoleculesInputCommon
					label="Peso do animal"
					max-width="25%"
					:value="store.form.animal_weight.value as number"
					@on-input="store.setFormField('animal_weight', $event)"
				/>
				<MoleculesInputCommon
					v-if="
						selectedCategory !== 'vaccine' && selectedCategory !== 'vermifuge'
					"
					label="Suprimento estimado (dias)"
					max-width="25%"
					:value="store.form.estimated_supply.value as string"
					:readonly="calculatedEstimatedSupply !== ''"
					@on-input="store.setFormField('estimated_supply', $event)"
				/>
			</div>
			<AtomsTypography
				v-if="
					selectedCategory !== 'vaccine' && selectedCategory !== 'vermifuge'
				"
				type="text-p6"
				:text="
					calculatedEstimatedSupply !== ''
						? `Baseado no estoque atual e peso do animal, este produto supre aproximadamente ${calculatedEstimatedSupply} dias.`
						: 'Selecione um produto e animal para calcular automaticamente o suprimento estimado.'
				"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
		</div>

		<!-- Campos específicos -->
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Campos específicos"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="applications-form__group">
				<MoleculesInputCommon
					v-if="selectedCategory !== 'medication'"
					label="Lote"
					max-width="25%"
					:value="store.form.lot_number.value as string"
					@on-input="store.setFormField('lot_number', $event)"
				/>
				<MoleculesInputCommon
					v-if="selectedCategory !== 'medication'"
					label="Validade"
					max-width="25%"
					:maxlength="10"
					:value="store.form.expiration_date.value as string"
					@on-input="onDateInput('expiration_date', $event)"
				/>
				<!-- Suplementação: Tipo de suplemento e Quantidade diária -->
				<MoleculesSelectsSimple
					v-if="selectedCategory === 'supplement'"
					label="Tipo de suplemento"
					max-width="25%"
					:options="supplementTypeOptions"
					:value="store.form.supplement_type.value as string"
					@item-selected="store.setFormField('supplement_type', $event.id)"
				/>
				<MoleculesInputCommon
					v-if="['supplement', 'food'].includes(selectedCategory)"
					label="Quantidade diária (g/kg)"
					max-width="25%"
					:value="String(store.form.daily_quantity_g_per_kg.value || '')"
					@on-input="store.setFormField('daily_quantity_g_per_kg', $event)"
				/>
				<MoleculesInputCommon
					v-if="selectedCategory === 'food'"
					label="Refeições por dia"
					max-width="25%"
					:value="String(store.form.meals_per_day.value || '')"
					@on-input="store.setFormField('meals_per_day', $event)"
				/>
				<MoleculesSelectsSimple
					v-if="
						['vaccine', 'vermifuge', 'medication'].includes(selectedCategory)
					"
					:label="
						['vermifuge', 'medication'].includes(selectedCategory)
							? 'Via de administração'
							: 'Via de aplicação'
					"
					max-width="25%"
					:options="routeOptions"
					:value="store.form.via_administration.value as string"
					@item-selected="store.setFormField('via_administration', $event.id)"
				/>
				<MoleculesSelectsSimple
					v-if="selectedCategory === 'medication'"
					label="Frequência"
					max-width="25%"
					:options="frequencyOptions"
					:value="String(store.form.frequency.value || '')"
					@item-selected="store.setFormField('frequency', $event.id)"
				/>
				<MoleculesSelectsSimple
					v-if="selectedCategory === 'medication'"
					label="Período (dias)"
					max-width="25%"
					:options="periodDaysOptions"
					:value="String(store.form.period_days.value || '')"
					@item-selected="store.setFormField('period_days', Number($event.id))"
				/>
				<MoleculesInputCommon
					v-if="['vaccine', 'vermifuge'].includes(selectedCategory)"
					label="Próxima dose"
					max-width="25%"
					:maxlength="10"
					:value="store.form.next_dose_date.value as string"
					@on-input="onDateInput('next_dose_date', $event)"
				/>
			</div>
			<MoleculesInputCommon
				label="Observações"
				max-width="100%"
				:value="store.form.observations.value as string"
				@on-input="store.setFormField('observations', $event)"
			/>
		</div>

		<div class="applications-form__actions">
			<MoleculesButtonsCommon
				type="primary"
				text="Salvar"
				icon-right
				name-icon-right="plus"
				@onclick="openConfirm"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.applications-form__tabs {
	margin-bottom: 16px;
}
.section-card {
	background: var(--brand-color-dark-blue-0);
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 16px;
}
.applications-form__group {
	display: flex;
	gap: 16px;
	flex-wrap: wrap;
}
.applications-form__actions {
	display: flex;
	justify-content: flex-end;
}
</style>
