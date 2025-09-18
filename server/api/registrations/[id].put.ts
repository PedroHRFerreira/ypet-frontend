import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const body = await readBody(event);
		const path = `/registrations/${id}`;

		return await apiPut<IResponse>(path, event, body);
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message,
			data: error,
		} as IResponse;
	}
});
