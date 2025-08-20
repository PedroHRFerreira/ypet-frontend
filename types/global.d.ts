declare global {
	interface IOption {
		id: string | number;
		text: string;
		value?: number;
		state?: "default" | "activated" | "disabled";
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
  }
}
export { IOption, IResponse, IAccessToken, IError, IEnum, FormFieldType, ITab };
