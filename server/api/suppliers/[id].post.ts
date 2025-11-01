import { apiPostForm } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const path = `/suppliers/${id}`;

		// Accept x-www-form-urlencoded or plain object and forward as URLSearchParams
		const body: any = await readBody(event);
		const params = new URLSearchParams();
		if (body instanceof URLSearchParams) {
			for (const [k, v] of body.entries()) params.append(k, String(v));
		} else if (body && typeof body === "object") {
			for (const key in body) {
				if (!Object.prototype.hasOwnProperty.call(body, key)) continue;
				const value = (body as Record<string, any>)[key];
				if (Array.isArray(value)) {
					for (const v of value) params.append(key, String(v));
				} else if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			}
		}

		return await apiPostForm<IResponse>(path, event, params);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao atualizar",
			data: error,
		} as IResponse;
	}
});
