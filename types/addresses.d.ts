declare global {
	interface IAddress {
		id: number;
		addressable_type: string;
		addressable_id: number;
		street: string;
		number: string;
		complement?: string | null;
		district?: string | null;
		city?: string | null;
		state?: string | null;
		zip_code?: string | null;
		country?: string | null;
		latitude?: string | null;
		longitude?: string | null;
		created_at: string;
		updated_at: string;
	}
}
export { IAddress };
