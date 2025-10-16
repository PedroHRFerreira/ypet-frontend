import type { IEnum } from "~/types/global";
import { IUser } from "~/types/user";
import { IAddresses } from "~/types/addresses";
declare global {
	interface ISupplier {
		uuid?: string;
		status: number;
		legal_name: string;
		business_name: string;
		document: string;
		municipal_registration: string;
		state_registration: string;
		representative: string;
		addresses?: IAddress[];
		created_at?: string;
		updated_at?: string;
		deleted_at?: string;
	}
}

export { ISupplier };
