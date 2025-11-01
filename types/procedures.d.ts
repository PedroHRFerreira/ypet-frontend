declare global {
	interface IProcedure {
		id?: number | string;
		procedure_type?: IEnum | string; // deprecated alias for older responses
		type?: IEnum | string; // tipo: triagem, exame, cirurgia, consulta
		performed_at?: string; // data do procedimento
		created_at?: string;
		updated_at?: string;
		status?: IEnum | IStatus;
		animal?: IAnimal;
		location?: ILocation;
	}
}

export {};
