export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const uuid = event.context.params?.uuid;
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/financial-statements/${uuid}/download`;

		const response = await $fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
				"X-Client-Type": "web",
			},
		});

		return {
			type: "success",
			show: false,
			status: 200,
			message: "URL de download gerada com sucesso",
			data: response,
		} as IResponse;
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao gerar URL de download",
			data: error,
		} as IResponse;
	}
});
