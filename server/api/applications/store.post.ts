import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const path = "/applications";

		const formData = await readFormData(event);
		const payload: Record<string, any> = {};
		for (const [key, value] of formData.entries()) {
			// Se algum campo for JSON serializado (ex.: campos compostos), parse aqui
			if (
				typeof value === "string" &&
				(key === "product" || key === "animal")
			) {
				try {
					payload[key] = JSON.parse(value);
				} catch {
					payload[key] = value;
				}
			} else {
				payload[key] = value;
			}
		}

		return await apiPost<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao armazenar aplicação",
			show: true,
			data: error,
		} as IResponse;
	}
});
