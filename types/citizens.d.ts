import type { IEnum } from "~/types/global";

declare global {
	interface ICitizens {
		name: string;
		document: string;
		gender: string;
		birth_date: string;
		telephone: string;
		email: string;
		street:string;
		number: string;
		zip_code:string;
		district: string;
		complement?: string;
		state: string;
		country?: string;
		special_permissions: boolean;
		can_report_abuse: boolean;
		can_mobile_castration: boolean;
		status?: IStatus;
		created_at?: string;
		updated_at?: string;
		deleted_at?: string;
	}
}

export { IVeterinarian };