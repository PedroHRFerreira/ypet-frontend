/**
 * Valida CPF ou CNPJ baseado no tamanho do documento
 * @param document - Documento com ou sem formatação
 * @returns true se válido, false se inválido
 */
export function useValidateCpfCnpj(document: string): boolean {
	const cleanDocument = document.replace(/\D/g, "");

	if (cleanDocument.length === 0) {
		return false;
	}

	if (cleanDocument.length === 11) {
		return useValidateDocumentPF(cleanDocument);
	}

	if (cleanDocument.length === 14) {
		return useValidateDocumentPJ(cleanDocument);
	}

	return false;
}
