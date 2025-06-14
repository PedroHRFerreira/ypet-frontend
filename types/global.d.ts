declare global {
	interface IOption {
		id: string;
		text: string;
		value?: number;
		state?: "default" | "activated" | "disabled";
	}
}
export { IOption };
