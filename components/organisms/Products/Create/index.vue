<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useProductsCreateStore } from "~/stores/products/useCreateStore";
import { useAnimalSpeciesEnumStore } from "~/stores/Enums/useAnimalSpeciesEnumStore";

export default defineComponent({
	name: "OrganismsProductsCreate",
	setup() {
		const store = useProductsCreateStore();
		const speciesStore = useAnimalSpeciesEnumStore();
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

		onMounted(async () => {
			await speciesStore.fetchAnimalSpeciesEnum();
			speciesOptions.value = await speciesStore.getOptions();
		});

		const router = useRouter();
		const handleCreate = async () => {
			const ok = await store.create();
			if (ok) {
				store.resetForm();
				router.push({ name: "products" });
			}
		};

		return {
			store,
			speciesOptions,
			unitOptions,
			categoryOptions,
			handleCreate,
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
				:value="store.form.validity.value as string"
				@on-input="store.setFormField('validity', $event)"
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
				text="Cadastrar"
				size="small"
				width="auto"
				@onclick="handleCreate"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>