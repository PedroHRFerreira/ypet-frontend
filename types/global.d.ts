import type { IUser } from "~/types/user";

declare global {
	interface IOption {
		id: string | number;
		text: string;
		value?: number;
		state?: "default" | "activated" | "disabled";
	}

	interface IStatus {
		id?: number;
		status: IEnum;
		description?: string;
		animal_id: number;
		created_by?: IUser;
		created_at?: string;
		updated_at?: string;
	}

	interface IRole {
		id: number;
		name: string;
		guard_name: string;
	}

	interface IAccessToken {
		access_token: string;
		expires_in: number;
		token_type: string;
		user: IUser;
	}

	interface IResponse {
		type: "success" | "error";
		status: number;
		data: any;
		message?: string;
		show: boolean;
		errors?: {
			[key: string]: string[];
		};
	}

	interface IError extends Error {
		statusCode?: number;
		data?: any;
	}

	interface IEnum {
		value: string | number;
		name: string;
		label: string;
		color?: string;
		description?: string;
	}

	type FormFieldType = {
		value: string | string[] | number | boolean | null;
		errorMessages: string[];
	};

	type ITab = {
		id: string;
		name: string;
		icon?: string;
		active?: boolean;
		disabled?: boolean;
	};

	type DashboardType = {
		id: string | number;
		title: string;
		value: number;
		difference: string;
		subtitle: string;
		icon?: string;
	};

	interface IPagination {
		current_page: number;
		data: any[];
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		links: Array<{
			url: string | null;
			label: string;
			active: boolean;
		}>;
		next_page_url: string | null;
		path: string;
		per_page: number;
		prev_page_url: string | null;
		to: number;
		total: number;
	}
}

export {
	IOption,
	IResponse,
	IAccessToken,
	IError,
	IEnum,
	FormFieldType,
	ITab,
	DashboardType,
	IPagination,
	IRole,
};
