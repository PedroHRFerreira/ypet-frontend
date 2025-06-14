export function useValidateDocumentPF(document: string): boolean {
	const cleanDocumentPF = document.replace(/\D/g, "");
	const hasInvalidLengthOrRepeatingDigits =
		cleanDocumentPF.length !== 11 || /^(\d)\1{10}$/.test(cleanDocumentPF);

	function calculateDigit(numbers: string, factor: number, max: number) {
		let sum = 0;
		for (let i = 0; i < max - 1; i++) {
			sum += parseInt(numbers[i]) * (factor - i);
		}
		const remainder = (sum * 10) % 11;
		return remainder === 10 || remainder === 11 ? 0 : remainder;
	}

	const firstDigit = calculateDigit(cleanDocumentPF, 10, 10);
	const secondDigit = calculateDigit(cleanDocumentPF, 11, 11);

	const isValidDigits =
		firstDigit === parseInt(cleanDocumentPF[9]) &&
		secondDigit === parseInt(cleanDocumentPF[10]);

	return !hasInvalidLengthOrRepeatingDigits && isValidDigits;
}
