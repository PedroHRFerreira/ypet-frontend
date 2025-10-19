import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const path = `/products/${id}`;
		const payload = await readBody(event);

		return await apiPut<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao atualizar produto",
			data: error,
		} as IResponse;
	}
});