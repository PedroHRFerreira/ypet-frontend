import { defineStore } from "pinia";
import { ref } from "vue";
import { useForm } from "~/composables/useForm";

export type ProductCategory =
	| "vaccine"
	| "vermifuge"
	| "medication"
	| "supplement"
	| "food"
	| "other";

export const useProductsCreateStore = defineStore("products-create", {
	state: () => {
		const isLoading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const category = ref<ProductCategory>("medication");
		const supplyMessage = ref("");

		const form = useForm([
			"name",
			"category",
			"manufacturer",
			"target_species",
			"unit",
			"has_stock_control",
			"stock",
			"min_stock",
			"is_active",
			"description",
			// condicionais
			"lot",
			"validity",
			"standard_quantity",
			"reference_weight",
			"standard_days",
			"base_unit",
			"supplement_type",
		]);

		form.category.value = category.value;
		form.is_active.value = true;
		form.has_stock_control.value = false;

		const pathStoreUrl = "/api/products/store";
		const pathUpdateUrl = (id: string | number) => `/api/products/${id}`;

		return {
			isLoading,
			errorMessage,
			successMessage,
			category,
			supplyMessage,
			form,
			pathStoreUrl,
			pathUpdateUrl,
		};
	},
	actions: {
		setCategory(cat: ProductCategory): void {
			this.category = cat;
			this.form.category.value = cat;
			this.updateSupplyMessage();
		},
		setFormField(key: string, value: any): void {
			if (this.form[key]) this.form[key].value = value;
			this.updateSupplyMessage();
		},
		updateSupplyMessage(): void {
			this.supplyMessage = "";
			const cat = this.category;
			if (cat !== "medication" && cat !== "food") return;

			const standardQty = Number(this.form.standard_quantity.value || 0);
			const refWeight = Number(this.form.reference_weight.value || 0);
			const standardDays = Number(this.form.standard_days.value || 0);

			if (!standardQty || !refWeight || !standardDays) {
				this.supplyMessage =
					"Informe quantidade padrão, peso de referência e dias de suprimento.";
				return;
			}

			const consumoPorKg = standardQty / (refWeight * standardDays);
			const unit = String(this.form.unit.value || "unidade");
			this.supplyMessage = `Consumo por kg: ${consumoPorKg.toFixed(
				4,
			)} ${unit}/kg/dia`;
		},
		validate(): boolean {
			this.errorMessage = "";
			// nome obrigatório
			if (!this.form.name.value) {
				this.errorMessage = "Informe o nome do produto.";
				return false;
			}

			// unidade obrigatória
			if (!this.form.unit.value) {
				this.errorMessage = "Informe a unidade de medida.";
				return false;
			}

			// estoque quando controle habilitado
			if (this.form.has_stock_control.value === true) {
				if (this.form.stock.value === null || this.form.stock.value === "") {
					this.errorMessage = "Informe a quantidade atual de estoque.";
					return false;
				}
				if (
					this.form.min_stock.value === null ||
					this.form.min_stock.value === ""
				) {
					this.errorMessage = "Informe a quantidade mínima de estoque.";
					return false;
				}
			}

			// condicionais por categoria
			if (this.category === "vaccine" || this.category === "vermifuge") {
				if (!this.form.lot.value || !this.form.validity.value) {
					this.errorMessage = "Informe lote e validade.";
					return false;
				}
			}
			if (
				this.category === "medication" ||
				this.category === "food" ||
				this.category === "supplement"
			) {
				if (
					!this.form.standard_quantity.value ||
					!this.form.reference_weight.value ||
					!this.form.standard_days.value ||
					!this.form.base_unit.value
				) {
					this.errorMessage =
						"Informe quantidade padrão, peso de referência, dias de suprimento e unidade base.";
					return false;
				}
			}

			if (this.category === "supplement" || this.category === "other") {
				if (!this.form.supplement_type.value) {
					this.errorMessage = "Informe o tipo de suplemento.";
					return false;
				}
			}

			return true;
		},
		getPayload(): Record<string, any> {
			const active = this.form.is_active.value === true;
			const payload: Record<string, any> = {
				name: this.form.name.value,
				category: this.form.category.value,
				manufacturer: this.form.manufacturer.value || undefined,
				target_species: this.form.target_species.value || undefined,
				unit: this.form.unit.value,
				has_stock_control: !!this.form.has_stock_control.value,
				stock: Number(this.form.stock.value || 0),
				min_stock: Number(this.form.min_stock.value || 0),
				is_active: active,
				status: active,
				observations: this.form.description.value || undefined,
			};

			if (this.category === "vaccine" || this.category === "vermifuge") {
				payload.lot_number = this.form.lot.value;
				payload.expiration_date = this.form.validity.value;
			}
			if (
				this.category === "medication" ||
				this.category === "food" ||
				this.category === "supplement"
			) {
				payload.standard_quantity = Number(
					this.form.standard_quantity.value || 0,
				);
				payload.reference_weight = Number(
					this.form.reference_weight.value || 0,
				);
				payload.standard_days = Number(this.form.standard_days.value || 0);
				payload.base_unit = this.form.base_unit.value;
			}
			if (this.category === "supplement" || this.category === "other") {
				payload.supplement_type = this.form.supplement_type.value;
			}
			return payload;
		},
		async create(): Promise<boolean> {
			if (this.isLoading) return false;
			if (!this.validate()) return false;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const payload = this.getPayload();

			const { data } = await useFetch(this.pathStoreUrl, {
				method: "POST",
				body: payload,
			});

			const response: IResponse = data.value as IResponse;

			this.isLoading = false;
			if (response?.type === "success") {
				this.successMessage =
					response?.message || "Produto cadastrado com sucesso.";
				return true;
			}
			this.errorMessage = response?.message || "Erro ao cadastrar produto.";
			return false;
		},
		async update(id: string | number): Promise<boolean> {
			if (this.isLoading) return false;
			if (!id) return false;
			if (!this.validate()) return false;

			this.isLoading = true;
			this.errorMessage = "";
			this.successMessage = "";
			const payload = this.getPayload();

			const { data } = await useFetch(this.pathUpdateUrl(id), {
				method: "PUT",
				body: payload,
			});

			const response: IResponse = data.value as IResponse;

			this.isLoading = false;
			if (response?.type === "success") {
				this.successMessage =
					response?.message || "Produto atualizado com sucesso.";
				return true;
			}
			this.errorMessage = response?.message || "Erro ao atualizar produto.";
			return false;
		},
		resetForm(): void {
			Object.keys(this.form).forEach((key) => {
				this.form[key].value = null;
				this.form[key].errorMessages = [];
			});
			this.form.is_active.value = true;
			this.form.has_stock_control.value = false;
			this.form.category.value = this.category;
			this.supplyMessage = "";
		},
	},
});
