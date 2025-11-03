export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const uuid = event.context.params?.uuid;
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/financial-statements/${uuid}`;

		const response = await $fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
				"X-Client-Type": "web",
			},
		});

		return {
			type: "success",
			show: true,
			status: 200,
			message: "Extrato removido com sucesso",
			data: response,
		} as IResponse;
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao remover extrato",
			data: error,
		} as IResponse;
	}
});
