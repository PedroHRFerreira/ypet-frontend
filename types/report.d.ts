import type { IEnum } from "~/types/global";

declare global {
	interface IReport {
		id?: number;
		uuid?: string;
		reporter_id: number;
		description: string;
		type: string;
		reporter: IUser;
		picture?: string;
		status?: string;
		created_at?: string;
		updated_at?: string;
	}
}

export { IReport };
