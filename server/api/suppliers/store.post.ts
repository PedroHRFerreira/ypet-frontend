import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const path = "/suppliers";

		// Assume sempre JSON no corpo
		const body = await readBody(event);
		const payload = (body || {}) as Record<string, any>;

		return await apiPost<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) return error.data as IResponse;

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao salvar fornecedor",
			data: error,
		} as IResponse;
	}
});
