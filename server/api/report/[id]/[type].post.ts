import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const type = event.context.params?.type;
		console.log(type);
		const path = `/reports/${id}/${type}`;

		return await apiPost<IResponse>(path, event, {});
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
