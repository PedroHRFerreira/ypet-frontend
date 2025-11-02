declare global {
	interface IFinancialStatement {
		uuid: string;
		year: number;
		month: number;
		month_name: string;
		file_original_name: string;
		file_path: string;
		status: "available" | "unavailable";
		created_at?: string;
		updated_at?: string;
		uploaded_at?: string;
	}

	interface IFinancialStatementMonth {
		month: number;
		month_name: string;
		year: number;
		status: "available" | "unavailable";
		statement: IFinancialStatement | null;
	}

	interface IFinancialStatementUpload {
		statementable_type: "Collaborator" | "Veterinarian" | "Supplier";
		statementable_id: number | string;
		year: number;
		month: number;
		file: File;
	}

	interface IFinancialStatementListParams {
		statementable_type: "Collaborator" | "Veterinarian" | "Supplier";
		statementable_id: number | string;
		year?: number;
		per_page?: number;
		order_by_column?: string;
		order_by_direction?: "asc" | "desc";
	}
}

export {
	IFinancialStatement,
	IFinancialStatementMonth,
	IFinancialStatementUpload,
	IFinancialStatementListParams,
};
