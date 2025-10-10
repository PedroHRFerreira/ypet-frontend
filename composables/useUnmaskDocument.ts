export function useUnmaskDocument(document: string): string {
	return document?.replace(/\D/g, "") || "";
}
