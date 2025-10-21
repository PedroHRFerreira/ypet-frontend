<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useProductsCreateStore } from "~/stores/products/useCreateStore";
import type { ProductCategory } from "~/stores/products/useCreateStore";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";
import { useDetailStore as useProductDetailStore } from "~/stores/products/useDetailStore";

export default defineComponent({
	name: "OrganismsProductsEdit",
	setup() {
		const store = useProductsCreateStore();
		const speciesStore = useAnimalSpeciesEnumStore();
		const detailStore = useProductDetailStore();
		const speciesOptions = ref<IOption[]>([]);

		// Mapeamento e opções
		const categoryTextMap: Record<string, string> = {
			vaccine: "Vacinas",
			vermifuge: "Vermífugos",
			medication: "Medicações",
			food: "Rações",
			supplement: "Suplementos",
			other: "Outros",
		};

		const isVaccineGroup = computed(() => {
			return ["vaccine", "vermifuge"].includes(store.category);
		});
		const categorySelectState = computed(() => {
			return isVaccineGroup.value ? "default" : "disabled";
		});
		const categorySelectOptions = computed<IOption[]>(() => {
			if (isVaccineGroup.value) {
				return [
					{ id: "vaccine", text: categoryTextMap.vaccine },
					{ id: "vermifuge", text: categoryTextMap.vermifuge },
				];
			}
			return [
				{
					id: store.category as string,
					text: categoryTextMap[store.category] || "",
				},
			];
		});

		const unitOptions = ref<IOption[]>([
			{ id: "ml", text: "ml" },
			{ id: "mg", text: "mg" },
			{ id: "g", text: "g" },
			{ id: "kg", text: "kg" },
			{ id: "unidade", text: "unidade" },
			{ id: "dose", text: "dose" },
		]);

		const baseUnitOptions = ref<IOption[]>([
			{ id: "ml", text: "ml" },
			{ id: "mg", text: "mg" },
			{ id: "g", text: "g" },
			{ id: "kg", text: "kg" },
			{ id: "unidade", text: "unidade" },
			{ id: "dose", text: "dose" },
		]);

		const supplementTypeOptions = ref<IOption[]>([
			{ id: "vitaminic", text: "Vitamínico" },
			{ id: "mineral", text: "Mineral" },
			{ id: "proteic", text: "Proteico" },
			{ id: "caloric_energetic", text: "Calórico/Energético" },
			{ id: "immunologic", text: "Imunológico" },
			{ id: "probiotic_digestive", text: "Probiótico/Digestivo" },
			{ id: "articular", text: "Articular" },
			{ id: "dermatologic_capillary", text: "Dermatológico/Capilar" },
		]);

		// Helpers de data iguais ao cadastro
		const formatDateToDisplay = (apiDate: string): string => {
			if (!apiDate) return "";
			const parts = apiDate.split("-");
			if (parts.length === 3) {
				return `${parts[2]}/${parts[1]}/${parts[0]}`;
			}
			return apiDate;
		};
		const formatDateToAPI = (displayDate: string): string => {
			if (!displayDate) return "";
			const numbersOnly = displayDate.replace(/\D/g, "");
			if (numbersOnly.length === 8) {
				const day = numbersOnly.substring(0, 2);
				const month = numbersOnly.substring(2, 4);
				const year = numbersOnly.substring(4, 8);
				return `${year}-${month}-${day}`;
			}
			return "";
		};
		const formatDateInput = (value: string): string => {
			const numbersOnly = value.replace(/\D/g, "").substring(0, 8);
			if (numbersOnly.length > 4) {
				return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4)}`;
			}
			if (numbersOnly.length > 2) {
				return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
			}
			return numbersOnly;
		};
		const validityRawValue = ref("");
		const handleValidityInput = (value: string) => {
			const formatted = formatDateInput(value);
			validityRawValue.value = formatted;
			const apiDate = formatDateToAPI(formatted);
			store.setFormField("validity", apiDate);
		};

		// Abas superiores de categoria
		const tabs = computed<ITab[]>(() => [
			{
				id: "vaccine",
				name: "Vacina/Vermífugo",
				active: ["vaccine", "vermifuge"].includes(store.category),
			},
			{
				id: "medication",
				name: "Medicamentos",
				active: store.category === "medication",
			},
			{
				id: "food",
				name: "Rações",
				active: store.category === "food",
			},
			{
				id: "supplement",
				name: "Suplementos",
				active: store.category === "supplement",
			},
		]);
		const handleTabChange = (tab: ITab) => {
			if (tab.id === "vaccine") {
				store.setCategory("vaccine");
			} else {
				store.setCategory(tab.id as any);
			}
		};

		const router = useRouter();
		const route = useRoute();
		onMounted(async () => {
			await speciesStore.fetchAnimalSpeciesEnum();
			speciesOptions.value = await speciesStore.getOptions();

			const id = route.params.id as string | number | undefined;
			if (id) {
				await detailStore.fetchById(id);
				const p = detailStore.product as any;

				store.setFormField("name", p?.name ?? store.form.name.value);
				store.setFormField(
					"manufacturer",
					p?.manufacturer ?? store.form.manufacturer.value,
				);
				store.setFormField(
					"unit",
					p?.unit?.value ?? p?.unit ?? store.form.unit.value,
				);
				store.setFormField(
					"target_species",
					p?.target_species?.value ??
						p?.target_species ??
						store.form.target_species.value,
				);
				store.setFormField(
					"has_stock_control",
					p?.has_stock_control ?? store.form.has_stock_control.value,
				);
				store.setFormField("stock", p?.stock ?? store.form.stock.value);
				store.setFormField(
					"min_stock",
					p?.min_stock ?? p?.min_stock ?? store.form.min_stock.value,
				);
				store.setFormField(
					"is_active",
					p?.is_active !== undefined
						? !!p.is_active
						: p?.status !== undefined
							? !!p.status
							: store.form.is_active.value,
				);
				store.setFormField(
					"description",
					p?.observations ?? p?.description ?? store.form.description.value,
				);

				const validityRaw =
					p?.expiration_date ?? p?.validity ?? store.form.validity.value;
				const validityYMD = typeof validityRaw === "string" ? validityRaw : "";
				validityRawValue.value = formatDateToDisplay(validityYMD);
				store.setFormField("validity", validityYMD);
				store.setFormField(
					"lot",
					p?.lot_number ?? p?.lot ?? store.form.lot.value,
				);
				store.setFormField(
					"standard_quantity",
					p?.standard_quantity ?? store.form.standard_quantity.value,
				);
				store.setFormField(
					"reference_weight",
					p?.reference_weight ?? store.form.reference_weight.value,
				);
				store.setFormField(
					"standard_days",
					p?.standard_days ?? store.form.standard_days.value,
				);
				store.setFormField(
					"base_unit",
					p?.base_unit?.value ?? p?.base_unit ?? store.form.base_unit.value,
				);
				store.setFormField(
					"supplement_type",
					p?.supplement_type?.value ??
						p?.supplement_type ??
						store.form.supplement_type.value,
				);

				const catVal = (p?.category?.value ??
					(typeof p?.category === "string"
						? p.category
						: store.category)) as ProductCategory;
				store.setCategory(catVal);

				const selectedUnit = String(store.form.unit.value || "");
				unitOptions.value = unitOptions.value.map((opt) => ({
					...opt,
					state: String(opt.id) === selectedUnit ? "activated" : "default",
				}));

				const selectedBaseUnit = String(store.form.base_unit.value || "");
				baseUnitOptions.value = baseUnitOptions.value.map((opt) => ({
					...opt,
					state: String(opt.id) === selectedBaseUnit ? "activated" : "default",
				}));

				const selectedSpecies = String(store.form.target_species.value || "");
				speciesOptions.value = speciesOptions.value.map((opt) => ({
					...opt,
					state: String(opt.id) === selectedSpecies ? "activated" : "default",
				}));
			}
		});

		const handleUpdate = async () => {
			const id = Number(route.params.id);
			const ok = await store.update(id);
			if (ok) {
				router.push({ name: "products" });
			}
		};

		return {
			store,
			speciesOptions,
			unitOptions,
			baseUnitOptions,
			supplementTypeOptions,
			tabs,
			handleTabChange,
			categorySelectOptions,
			categorySelectState,
			validityRawValue,
			handleValidityInput,
			handleUpdate,
		};
	},
});
</script>

<template>
	<div class="product-form">
		<!-- Abas principais -->
		<div class="product-form__tabs">
			<MoleculesTabs :tabs="tabs" @changeTab="handleTabChange" />
		</div>

		<!-- Identificação -->
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Identificação"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Nome do produto"
					max-width="50%"
					:value="store.form.name.value as string"
					@on-input="store.setFormField('name', $event)"
				/>
				<MoleculesSelectsSimple
					label="Categoria"
					:state="categorySelectState"
					max-width="50%"
					:options="categorySelectOptions"
					:value="store.form.category.value as string"
					@item-selected="store.setCategory($event.id)"
				/>
			</div>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Fabricante"
					max-width="50%"
					:value="store.form.manufacturer.value as string"
					@on-input="store.setFormField('manufacturer', $event)"
				/>
				<MoleculesSelectsSimple
					label="Espécie alvo"
					max-width="50%"
					:options="speciesOptions"
					@item-selected="store.setFormField('target_species', $event.id)"
				/>
			</div>
		</div>

		<!-- Estoque e status -->
		<div class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Estoque e status"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="product-form__group">
				<MoleculesSelectsSimple
					label="Unidade de medida"
					max-width="25%"
					:options="unitOptions"
					@item-selected="store.setFormField('unit', $event.id)"
				/>
				<MoleculesSelectsSimple
					label="Controle de estoque"
					max-width="25%"
					:options="[
						{ id: 'true', text: 'Sim' },
						{ id: 'false', text: 'Não' },
					]"
					:value="store.form.has_stock_control.value ? 'true' : 'false'"
					@item-selected="
						store.setFormField('has_stock_control', $event.id === 'true')
					"
				/>
				<MoleculesInputCommon
					v-if="store.form.has_stock_control.value"
					label="Quantidade atual"
					max-width="25%"
					:value="String(store.form.stock.value || '')"
					@on-input="store.setFormField('stock', $event)"
				/>
				<MoleculesSelectsSimple
					label="Status"
					max-width="25%"
					:options="[
						{ id: 'true', text: 'Ativo' },
						{ id: 'false', text: 'Inativo' },
					]"
					:value="store.form.is_active.value ? 'true' : 'false'"
					@item-selected="store.setFormField('is_active', $event.id === 'true')"
				/>
			</div>
			<div
				class="product-form__group"
				v-if="store.form.has_stock_control.value"
			>
				<MoleculesInputCommon
					label="Quantidade mínima"
					max-width="25%"
					:value="String(store.form.min_stock.value || '')"
					@on-input="store.setFormField('min_stock', $event)"
				/>
			</div>
		</div>

		<!-- Rastreamento e validade -->
		<div
			v-if="['vaccine', 'vermifuge'].includes(store.category)"
			class="section-card"
		>
			<AtomsTypography
				type="text-p3"
				text="Rastreamento e validade"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Lote"
					max-width="50%"
					:value="store.form.lot.value as string"
					@on-input="store.setFormField('lot', $event)"
				/>
				<MoleculesInputCommon
					label="Validade"
					placeholder="dd/mm/yyyy"
					max-width="50%"
					:maxlength="10"
					:value="validityRawValue"
					@on-input="handleValidityInput"
				/>
			</div>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Observações"
					max-width="100%"
					:value="store.form.description.value as string"
					@on-input="store.setFormField('description', $event)"
				/>
			</div>
		</div>

		<!-- Medicações/Rações/Suplementos -->
		<div
			v-if="['medication', 'food', 'supplement'].includes(store.category)"
			class="section-card"
		>
			<AtomsTypography
				type="text-p3"
				:text="
					['medication', 'food', 'supplement'].includes(store.category)
						? 'Cálculo de suprimento padrão'
						: 'Dosagem e referência'
				"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="product-form__group">
				<MoleculesSelectsSimple
					v-if="store.category === 'supplement'"
					label="Tipo de suplemento"
					max-width="25%"
					:options="supplementTypeOptions"
					:value="store.form.supplement_type.value as string"
					@item-selected="store.setFormField('supplement_type', $event.id)"
				/>
				<MoleculesInputCommon
					label="Quantidade padrão"
					max-width="25%"
					:value="String(store.form.standard_quantity.value || '')"
					@on-input="store.setFormField('standard_quantity', $event)"
				/>
				<MoleculesInputCommon
					label="Peso de referência (kg)"
					max-width="25%"
					:value="String(store.form.reference_weight.value || '')"
					@on-input="store.setFormField('reference_weight', $event)"
				/>
				<MoleculesInputCommon
					label="Dias de suprimento"
					max-width="25%"
					:value="String(store.form.standard_days.value || '')"
					@on-input="store.setFormField('standard_days', $event)"
				/>
				<MoleculesSelectsSimple
					label="Unidade base"
					max-width="25%"
					:options="baseUnitOptions"
					:value="store.form.base_unit.value as string"
					@item-selected="store.setFormField('base_unit', $event.id)"
				/>
			</div>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Observações"
					max-width="100%"
					:value="store.form.description.value as string"
					@on-input="store.setFormField('description', $event)"
				/>
			</div>
		</div>

		<!-- Outros -->
		<div v-if="store.category === 'other'" class="section-card">
			<AtomsTypography
				type="text-p3"
				text="Informações complementares"
				weight="medium"
				color="var(--brand-color-dark-blue-300)"
			/>
			<div class="product-form__group">
				<MoleculesInputCommon
					label="Tipo de suplemento"
					max-width="50%"
					:value="store.form.supplement_type.value as string"
					@on-input="store.setFormField('supplement_type', $event)"
				/>
			</div>
		</div>

		<div class="product-form__group">
			<AtomsTypography
				type="text-p5"
				:text="store.supplyMessage"
				weight="regular"
				color="var(--brand-color-dark-blue-300)"
			/>
		</div>

		<div class="product-form__group actions">
			<MoleculesButtonsCommon
				type="primary"
				text="Salvar"
				size="small"
				width="auto"
				@onclick="handleUpdate"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
