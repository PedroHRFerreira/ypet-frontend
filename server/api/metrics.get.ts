import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const path = "/metrics";
		const response = await apiGet<IResponse>(path, event, {});
		return response;
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao carregar métricas",
			data: error,
		} as IResponse;
	}
});
