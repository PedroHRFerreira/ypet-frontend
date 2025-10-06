import type { IEnum } from "~/types/global";
import { IUser } from "~/types/user";
import { IAddresses } from "~/types/addresses";
declare global {
	interface ICitizens {
		id?: number;
		uuid?: string;
		name: string;
		document: string;
		gender: string;
		birth_date: string;
		telephone: string;
		email: string;
		street: string;
		number: string;
		zip_code: string;
		district: string;
		city: string;
		complement?: string;
		state: string;
		country?: string;
		special_permissions: boolean;
		can_report_abuse: boolean;
		can_mobile_castration: boolean;
		status?: IStatus;
		user?: IUser;
		addresses?: IAddress[];
		created_at?: string;
		updated_at?: string;
		deleted_at?: string;
	}
}

export { ICitizens };
