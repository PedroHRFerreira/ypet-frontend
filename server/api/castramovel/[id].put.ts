import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/registrations/${id}`;
		const body = await readBody(event);

		const response = await $fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Client-Type": "web",
				Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			},
			body,
		});

		return {
			status: "success",
			statusCode: 200,
			message: "Cadastro realizado com sucesso",
			data: response,
		} as IResponse;

		// return await apiPut<IResponse>(path, event, payload);
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
