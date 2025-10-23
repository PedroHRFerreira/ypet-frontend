import type { IEnum } from "~/types/global";

declare global {
	interface IEvaluationPet {
		id?: number;
		uuid?: string;
		tutor_id: number;
		animal_id: number;
		animal: IAnimal;
		user: IUser;
		status?: string;
		created_at?: string;
		updated_at?: string;
	}
}

export { IEvaluationPet };
