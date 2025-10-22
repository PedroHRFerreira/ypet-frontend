import type { IEnum } from "~/types/global";

declare global {
	interface IAnimalStatus {
		id?: number;
		status: IEnum;
		description?: string;
		animal_id: number;
		created_by?: IUser;
		created_at?: string;
		updated_at?: string;
	}

	interface IAnimalEntryData {
		id?: number;
		animal_id?: number;
		registration_number: number;
		microchip_number: number;
		picture?: string;
		entry_date: string;
		castrated: boolean;
		castration_at?: string;
		castration_site?: string;
		dewormed: boolean;
		infirmity: string;
		origin: IEnum;
		collection_site?: string;
		collection_reason?: string;
		created_at?: string;
		updated_at?: string;
	}
	interface IAnimal {
		id?: number;
		hash?: string;
		tenant_id?: number;
		company_id?: number;
		tutor_id?: number;
		name: string;
		species: IEnum;
		gender: IEnum;
		weight: number;
		birth_date: string;
		size: IEnum;
		color: string;
		coat?: IEnum;
		characteristics?: string;
		surname?: string;
		picture?: string;
		created_at?: string;
		updated_at?: string;
		status?: IAnimalStatus;
		history_statuses?: IAnimalStatus[];
		entry_data?: IAnimalEntryData;
		created_by?: IUser;
	}
}
export { IAnimal, IAnimalStatus };
