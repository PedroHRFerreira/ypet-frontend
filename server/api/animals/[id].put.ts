import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const body = await readFormData(event);
		const path = `/animals/${id}`;
		const payload: Record<string, any> = {};
		body.forEach((value: any, key: any) => {
			payload[key] = value;
		});

		return await apiPut<IResponse>(path, event, payload);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao atualizar animal",
			data: error,
		} as IResponse;
	}
});
