<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
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

		const categoryOptions = ref<IOption[]>([
			{ id: "vaccine", text: "Vacinas" },
			{ id: "vermifuge", text: "Vermífugos" },
			{ id: "medication", text: "Medicações" },
			{ id: "food", text: "Rações" },
			{ id: "supplement", text: "Suplementos" },
			{ id: "other", text: "Outros" },
		]);

		const unitOptions = ref<IOption[]>([
			{ id: "ml", text: "ml" },
			{ id: "mg", text: "mg" },
			{ id: "g", text: "g" },
			{ id: "kg", text: "kg" },
			{ id: "unidade", text: "unidade" },
			{ id: "dose", text: "dose" },
		]);

		// Validade: texto exibido e helpers de normalização
		const validityText = ref<string>("");
		function normalizeToYMD(value: string | Date | null | undefined): string {
			if (!value) return "";
			if (value instanceof Date) {
				const y = value.getFullYear();
				const m = String(value.getMonth() + 1).padStart(2, "0");
				const d = String(value.getDate()).padStart(2, "0");
				return `${y}-${m}-${d}`;
			}
			const s = String(value).trim();
			if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
			if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);
			if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
				const [d, m, y] = s.split("/");
				return `${y}-${m}-${d}`;
			}
			const dt = new Date(s);
			if (!isNaN(dt.getTime())) {
				const y = dt.getFullYear();
				const m = String(dt.getMonth() + 1).padStart(2, "0");
				const d = String(dt.getDate()).padStart(2, "0");
				return `${y}-${m}-${d}`;
			}
			return s;
		}
		function formatToDMY(ymd: string): string {
			if (!ymd) return "";
			if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
				const [y, m, d] = ymd.split("-");
				return `${d}/${m}/${y}`;
			}
			const dt = new Date(ymd);
			if (!isNaN(dt.getTime())) {
				const y = dt.getFullYear();
				const m = String(dt.getMonth() + 1).padStart(2, "0");
				const d = String(dt.getDate()).padStart(2, "0");
				return `${d}/${m}/${y}`;
			}
			return ymd;
		}
		function onInputValidity(val: string) {
			const ymd = normalizeToYMD(val);
			validityText.value = formatToDMY(ymd);
			if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
				store.setFormField("validity", ymd);
			}
		}

		const router = useRouter();
		const route = useRoute();
		onMounted(async () => {
			await speciesStore.fetchAnimalSpeciesEnum();
			speciesOptions.value = await speciesStore.getOptions();

			// Buscar por ID e hidratar sempre ao abrir edição
			const id = route.params.id as string | number | undefined;
			if (id) {
				await detailStore.fetchById(id);
				const p = detailStore.product as any;

				// Hidratar campos com mapeamento dos nomes da API
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
					p?.target_species?.value ?? p?.target_species ?? store.form.target_species.value,
				);
				store.setFormField(
					"has_stock_control",
					p?.has_stock_control ?? store.form.has_stock_control.value,
				);
				store.setFormField("stock", p?.stock ?? store.form.stock.value);
				store.setFormField(
					"minimum_stock",
					p?.min_stock ?? p?.minimum_stock ?? store.form.minimum_stock.value,
				);
				store.setFormField(
					"is_active",
					p?.status !== undefined ? !!p.status : store.form.is_active.value,
				);
				store.setFormField(
					"description",
					p?.observations ?? p?.description ?? store.form.description.value,
				);
				// Validade: normalizar para YYYY-MM-DD e exibir como DD/MM/YYYY
				const validityRaw = p?.expiration_date ?? p?.validity ?? store.form.validity.value;
				const validityYMD = normalizeToYMD(validityRaw);
				store.setFormField("validity", validityYMD);
				validityText.value = formatToDMY(validityYMD);
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
					p?.base_unit ?? store.form.base_unit.value,
				);

				// Categoria como objeto: usar p.category.value
				const catVal = (
					p?.category?.value ??
					(typeof p?.category === "string" ? p.category : store.category)
				) as ProductCategory;
				store.setCategory(catVal);

				// Marcar seleção inicial nos selects (unit e target_species)
				const selectedUnit = String(store.form.unit.value || "");
				unitOptions.value = unitOptions.value.map((opt) => ({
					...opt,
					state: String(opt.id) === selectedUnit ? "activated" : "default",
				}));

				const selectedSpecies = String(store.form.target_species.value || "");
				speciesOptions.value = speciesOptions.value.map((opt) => ({
					...opt,
					state:
						String(opt.id) === selectedSpecies ? "activated" : "default",
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
			categoryOptions,
			handleUpdate,
			validityText,
			onInputValidity,
		};
	},
});
</script>

<template>
	<div class="product-form">
		<div class="product-form__group">
			<MoleculesInputCommon
				label="Nome do produto"
				max-width="50%"
				:value="store.form.name.value as string"
				@on-input="store.setFormField('name', $event)"
			/>
			<MoleculesInputOptionGroup
				label="Categoria"
				name="form-category"
				max-width="50%"
				:options="categoryOptions"
				:value="store.form.category.value as string"
				@changeOption="store.setCategory($event.id)"
			/>
		</div>
		<div class="product-form__group">
			<MoleculesInputCommon
				label="Fabricante"
				max-width="33%"
				:value="store.form.manufacturer.value as string"
				@on-input="store.setFormField('manufacturer', $event)"
			/>
			<MoleculesSelectsSimple
				label="Espécie alvo"
				max-width="33%"
				:options="speciesOptions"
				@item-selected="store.setFormField('target_species', $event.id)"
			/>
			<MoleculesSelectsSimple
				label="Unidade de medida"
				max-width="33%"
				:options="unitOptions"
				@item-selected="store.setFormField('unit', $event.id)"
			/>
		</div>
		<div class="product-form__group">
			<MoleculesInputOptionGroup
				label="Controle de estoque"
				name="stock-control"
				max-width="33%"
				:options="[
					{ id: 1, text: 'Sim' },
					{ id: 0, text: 'Não' },
				]"
				:value="store.form.has_stock_control.value ? 1 : 0"
				@changeOption="store.setFormField('has_stock_control', !!$event.id)"
			/>
			<MoleculesInputCommon
				v-if="store.form.has_stock_control.value"
				label="Quantidade atual"
				max-width="33%"
				:value="String(store.form.stock.value || '')"
				@on-input="store.setFormField('stock', $event)"
			/>
			<MoleculesInputCommon
				v-if="store.form.has_stock_control.value"
				label="Quantidade mínima"
				max-width="33%"
				:value="String(store.form.minimum_stock.value || '')"
				@on-input="store.setFormField('minimum_stock', $event)"
			/>
		</div>
		<div class="product-form__group">
			<MoleculesInputOptionGroup
				label="Status"
				name="status"
				max-width="33%"
				:options="[
					{ id: 1, text: 'Ativo' },
					{ id: 0, text: 'Inativo' },
				]"
				:value="store.form.is_active.value ? 1 : 0"
				@changeOption="store.setFormField('is_active', !!$event.id)"
			/>
			<MoleculesInputCommon
				label="Observações"
				max-width="66%"
				:value="store.form.description.value as string"
				@on-input="store.setFormField('description', $event)"
			/>
		</div>

		<!-- Vaccines/Dewormers -->
		<div
			v-if="['vaccine', 'vermifuge'].includes(store.category)"
			class="product-form__group"
		>
			<MoleculesInputCommon
				label="Lote"
				max-width="50%"
				:value="store.form.lot.value as string"
				@on-input="store.setFormField('lot', $event)"
			/>
			<MoleculesInputCommon
				label="Validade"
				max-width="50%"
				:value="validityText"
				@on-input="onInputValidity"
			/>
		</div>

		<!-- Medications/Feeding -->
		<div
			v-if="['medication', 'food'].includes(store.category)"
			class="product-form__group"
		>
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
				:options="unitOptions"
				@item-selected="store.setFormField('base_unit', $event.id)"
			/>
		</div>

		<!-- Supplements/Others -->
		<div
			v-if="['supplement', 'other'].includes(store.category)"
			class="product-form__group"
		>
			<MoleculesInputCommon
				label="Tipo de suplemento"
				max-width="50%"
				:value="store.form.supplement_type.value as string"
				@on-input="store.setFormField('supplement_type', $event)"
			/>
		</div>

		<div class="product-form__group">
			<AtomsTypography
				type="text-p5"
				:text="store.supplyMessage"
				weight="regular"
				color="var(--brand-color-dark-blue-300)"
			/>
		</div>

		<div class="product-form__group">
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