declare global {
	interface IBankAccount {
		id?: number | string;
		accountable_type?: string;
		accountable_id?: number;
		account_type: IEnum;
		bank_code: string;
		bank_name: string;
		agency: string;
		account_number: string;
		account_holder_name: string;
		account_holder_document: string;
		pix_key: string;
		pix_key_type: IEnum;
		created_at?: string;
		updated_at?: string;
	}

	interface ICollaborator {
		id?: number | string;
		user_id?: number | string;
		cnpj: string;
		work_started_at: string;
		work_ended_at: string;
		observations: string;
		created_at: string;
		updated_at: string;
		bank_account?: IBankAccount;
		user: IUser;
	}
}
export { ICollaborator, IBankAccount };
