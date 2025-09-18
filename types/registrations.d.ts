declare global {
	interface IRegistration {
		id?: number | string;
		mobile_clinic_event_id: number;
		user_id?: number;
		animal_id?: number;
		status: IEnum;
		created_at?: string;
		updated_at?: string;
		user?: IUser;
		animal?: IAnimal;
		mobile_clinic_event?: IMobileClinicEvent;
	}
}

export {};
