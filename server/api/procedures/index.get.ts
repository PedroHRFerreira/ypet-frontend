import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const params = getQuery(event);
		const path = "/procedures";

		return await apiGet<IResponse>(path, event, params);
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao listar procedimentos",
			show: true,
			data: error,
		} as IResponse;
	}
});
