export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/financial-statements`;

		const formData = await readFormData(event);

		const response = await $fetch(url, {
			method: "POST",
			headers: {
				Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
				"X-Client-Type": "web",
			},
			body: formData,
		});

		return {
			type: "success",
			show: true,
			status: 201,
			message: "Extrato financeiro adicionado com sucesso",
			data: response,
		} as IResponse;
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao adicionar extrato financeiro",
			data: error,
		} as IResponse;
	}
});
