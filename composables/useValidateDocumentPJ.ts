export function useValidateDocumentPJ(document: string): boolean {
	const cleanDocumentPJ = document.replace(/\D/g, "");
	const isValidLength = cleanDocumentPJ.length === 14;
	const hasRepeatingDigits = /^(\d)\1+$/.test(cleanDocumentPJ);

	function calculateDigit(numbers: string, positions: number) {
		let sum = 0;
		let pos = positions - 7;

		for (let i = positions; i >= 1; i--) {
			sum += parseInt(numbers.charAt(positions - i)) * pos--;
			if (pos < 2) {
				pos = 9;
			}
		}
		const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
		return result;
	}
	const firstDigit = calculateDigit(cleanDocumentPJ, 12);
	const secondDigit = calculateDigit(cleanDocumentPJ, 13);

	const isValidDigits =
		parseInt(cleanDocumentPJ.charAt(12)) === firstDigit &&
		parseInt(cleanDocumentPJ.charAt(13)) === secondDigit;

	return isValidLength && !hasRepeatingDigits && isValidDigits;
}
