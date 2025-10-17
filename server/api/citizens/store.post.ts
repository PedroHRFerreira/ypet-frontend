import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const path = "/citizen";

		const formData = await readFormData(event);
		const payload: Record<string, any> = {};
		for (const [key, value] of formData.entries()) {
			if (key === "address" && typeof value === "string") {
				payload[key] = JSON.parse(value);
			} else {
				payload[key] = value;
			}
		}

		return await apiPost<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) return error.data as IResponse;

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao armazenar citizen",
			data: error,
		} as IResponse;
	}
});
