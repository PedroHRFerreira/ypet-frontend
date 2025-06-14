export function useMaskDocument(document: string) {
	document = document?.replace(/\D/g, "");
	if (document?.length <= 11) {
		let cpfMasked = document;
		cpfMasked = cpfMasked.replace(/\D/g, "");
		cpfMasked = cpfMasked.replace(/(\d{3})(\d)/, "$1.$2");
		cpfMasked = cpfMasked.replace(/(\d{3})(\d)/, "$1.$2");
		cpfMasked = cpfMasked.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

		return cpfMasked;
	}

	let cnpjMask = document;
	cnpjMask = cnpjMask?.replace(/\D/g, "");
	cnpjMask = cnpjMask?.replace(/^(\d{2})(\d)/, "$1.$2");
	cnpjMask = cnpjMask?.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	cnpjMask = cnpjMask?.replace(/\.(\d{3})(\d)/, ".$1/$2");
	cnpjMask = cnpjMask?.replace(/(\d{4})(\d)/, "$1-$2");

	return cnpjMask;
}
