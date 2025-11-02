export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/auth/me/password`;
		const body = await readBody(event);

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

		return {
			type: "success",
			status: 200,
			message: "Senha alterada com sucesso",
			data: response,
		} as IResponse;
	} catch (error: any) {
		if (error.status === 422) {
			return {
				type: "error",
				status: 422,
				message: error.data?.message || "Erro de validação",
				errors: error.data?.errors || {},
			} as IResponse;
		}

		if (error.status === 401) {
			return {
				type: "error",
				status: 401,
				message: error.data?.message || "Não autorizado",
				errors: error.data?.errors || {},
			} as IResponse;
		}

		return {
			type: "error",
			status: error.status || 500,
			message: error.data?.message || error.message || "Erro ao alterar senha",
			errors: error.data?.errors || {},
		} as IResponse;
	}
});
