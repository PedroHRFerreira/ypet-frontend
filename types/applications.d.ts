declare global {
	interface IApplication {
		id?: number; // bigint unsigned
		uuid?: string; // UUID (gerado pelo backend)

		animal_id: number; // FK animals
		product_id: number; // FK products

		category: IEnum | string; // ProductCategoryEnum
		application_date: string; // YYYY-MM-DD

		animal_weight?: number; // decimal(10,2)
		estimated_days_supply?: number; // decimal(10,2)

		responsible_user_id: number; // FK users

		lot_number?: string;
		expiration_date?: string; // YYYY-MM-DD
		supplement_type?: string;
		via_administration?: string;
		next_dose_date?: string; // YYYY-MM-DD
		frequency?: string;
		period_days?: number;
		dosage_observations?: string;
		daily_quantity_g_per_kg?: number; // decimal(10,3)
		meals_per_day?: number;
		observations?: string;

		created_at?: string;
		updated_at?: string;
	}
}

export {};
