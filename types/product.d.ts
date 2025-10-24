declare global {
	interface IProduct {
		id?: number;
		name: string;
		category?: string | IEnum;
		manufacturer?: string;
		target_species?: string | IEnum; // espécie alvo (dog, cat, both)
		unit?: string; // unidade de medida (ml, mg, g, kg, unidade, dose)
		base_unit?: string; // unidade base para cálculo (quando aplicável)
		standard_quantity?: number; // quantidade padrão do produto (base)
		reference_weight?: number; // peso de referência (kg)
		standard_days?: number; // dias padrão para consumo
		has_stock_control?: boolean; // controle de estoque (sim/não)
		stock?: number; // estoque atual do produto
		min_stock?: number; // estoque mínimo
		is_active?: boolean; // produto ativo
		lot?: string; // lote (vacinas/vermífugos)
		validity?: string; // data de validade ISO (YYYY-MM-DD)
		supplement_type?: string; // tipo de suplemento (suplementos/outros)
		description?: string;
	}
}

export { IProduct };
