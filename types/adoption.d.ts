import type { IEnum } from "~/types/global";

declare global {
	interface IAdoption {
		id?: number;
		uuid?: string;
		citizen_id: number;
        animal_id: number;
		animal: IAnimal;
		user: IUser;
		citizen: ICitizens;
		start_date?: string;
		date_end?: string;
		status?: string;
        actions?: string;
		visit_time?: String;
        created_at?: string;
        updated_at?: string;
	}
}

export { IAdoption };
