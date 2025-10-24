declare global {
	interface IMobileClinicEventRule {
		id?: number | string;
		mobile_clinic_event_id?: number | strin;
		specie: IEnum;
		gender: IEnum;
		max_registrations: number;
		created_at?: string;
		updated_at?: string;
	}
  interface ILocation {
		id?: number | string;
		uuid?: string;
		location_name?: string;
		location_type?: string;
		responsible_name?: string;
		phone?: number;
		email?: string;
		cnpj?: string;
		bank_account_or_pix?: string;
		status?: number;
		notes?: string;
		created_at?: string;
		updated_at?: string;
	}
	interface IMobileClinicEvent {
		id?: number | string;
		name: string;
		description: string;
		location: ILocation;
		location_id?: number;
		start_date: string;
		end_date: string;
		status: IEnum;
		species?: IEnum;
		gender?: IEnum;
		created_at?: string;
		updated_at?: string;
		registrations?: IRegistration[];
		max_registrations?: number;
		current_registrations?: number;
		rules?: IMobileClinicEventRule[];
	}
}

export {};
