declare global {
	interface IMobileClinicEvent {
		id?: number | string;
		name: string;
		description: string;
		location: string;
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
	}
}

export {};
