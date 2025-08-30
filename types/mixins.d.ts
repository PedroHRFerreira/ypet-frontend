export {};

declare module "vue" {
	interface ComponentCustomProperties {
		$formatDate: (date: string | number | Date | undefined) => string;
		$formatDateTime: (date: string | number | Date | undefined) => string;
		$formatDateTimeFromNow: (
			date: string | number | Date | undefined,
		) => string;
		$booleanToSimNao: (value: boolean | undefined) => string;
	}
}
