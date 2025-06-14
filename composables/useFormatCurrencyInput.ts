export function useFormatCurrencyInput() {
	const formatCurrency = (value: string): string => {
		let numericValue = value.replace(/\D/g, "");
		numericValue = (parseInt(numericValue) / 100).toFixed(2) + "";
		numericValue = numericValue.replace(".", ",");
		numericValue = numericValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
		return numericValue ? `R$ ${numericValue}` : "";
	};

	return { formatCurrency };
}
