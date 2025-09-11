import type { IEnum } from "~/types/global";
import { IUser } from "~/types/user";

declare global {
	interface IVeterinarian {
		id?: number;
		hash?: string;
		tenant_id?: number;
		company_id?: number;
		user_id: number;
		crmv: string;
		profile_picture: string;
		linked_institution: string;
		linked_type: IEnum;
		observations?: string;
		created_at?: string;
		updated_at?: string;
		deleted_at?: string;
		can_access_castro_mobile?: boolean;
		can_apply_vaccine?: boolean;
		user?: IUser;
		status?: IStatus;
	}
}

export { IVeterinarian };
