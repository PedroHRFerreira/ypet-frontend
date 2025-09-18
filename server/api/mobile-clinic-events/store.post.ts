import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const path = "/mobile-clinic-events";
		const formData = await readFormData(event);
		const payload: Record<string, any> = {};
		formData.forEach((value, key) => {
			payload[key] = value;
		});

		return await apiPost<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message,
			data: error,
		} as IResponse;
	}
});
