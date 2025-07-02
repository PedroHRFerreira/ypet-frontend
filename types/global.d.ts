declare global {
	interface IOption {
		id: string;
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
    status: "success" | "error";
    statusCode: number;
    message: string;
    data: any;
  }
}
export { IOption, IResponse, IAccessToken };
