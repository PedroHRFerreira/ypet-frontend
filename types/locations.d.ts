export interface IAddress {
	neighborhood: string;
	street: string;
	number: string;
	complement?: string;
	city?: string;
	state?: string;
	zipcode?: string;
}

export interface ILocation {
	id: number;
	uuid: string;
	location_name: string;
	location_type: string;
	responsible_name: string;
	phone: number;
	email?: string | null;
	cnpj?: string | null;
	bank_account_or_pix?: string | null;
	status: number;
	notes?: string | null;
	addresses: IAddress;
	created_at: string;
	updated_at: string;
}
