export interface IAddress {
	neighborhood: string;
	street: string;
	number: string;
	complement?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	district?: string;
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

export interface IFormFields {
	location_name: string | null;
	location_type: string | null;
	responsible_name: string | null;
	phone: number | null;
	email: string | null;
	cnpj: string | null;
	bank_account_or_pix: string | null;
	status: number | null;
	notes: string | null;
	address_street: string | null;
	address_number: string | null;
	address_zipcode: string | null;
	address_neighborhood: string | null;
	address_city: string | null;
	address_state: string | null;
	address_complement: string | null;
}
