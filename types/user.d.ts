declare global {
	interface IUser {
		id: number;
		name: string;
		email: string;
		telephone?: string;
		cellphone?: string;
		document?: string;
		email_verified_at?: string;
		created_at: string;
		updated_at: string;
		status?: IStatus;
		roles?: IRole[];
	}
}
export { IUser };
