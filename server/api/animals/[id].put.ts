export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const body = await readBody(event);
		const animalsId = event.context.params?.id;
		const url = `${apiBaseUrl}/animals/${animalsId}`;

		const response = await $fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
        Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
				"X-Client-Type": "web",
			},
			body,
		});

		return response as IResponse;
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			status: "error",
			statusCode: error?.statusCode || 500,
			message: error.message || "Erro ao armazenar animal",
			data: error,
		} as IResponse;
	}
});
