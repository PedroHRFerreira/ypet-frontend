export const usePhoneFormatter11BR = (value: string): string => {
	const numericValue = value.replace(/\D/g, "");

	const match = numericValue.match(/^(\d{2})(\d{5})(\d{4})$/);
	if (match) {
		return `(${match[1]}) ${match[2]}-${match[3]}`;
	}

	const matchShort = numericValue.match(/^(\d{2})(\d{4})(\d{4})$/);
	if (matchShort) {
		return `(${matchShort[1]}) ${matchShort[2]}-${matchShort[3]}`;
	}

	return value;
};
