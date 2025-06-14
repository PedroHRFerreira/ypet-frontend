export function useMaskZipCode(cep: string) {
	let zipCodeMasked = cep;
	zipCodeMasked = zipCodeMasked?.replace(/\D/g, "");
	zipCodeMasked = zipCodeMasked?.replace(/^(\d{5})(\d)/, "$1-$2");

	return zipCodeMasked;
}
