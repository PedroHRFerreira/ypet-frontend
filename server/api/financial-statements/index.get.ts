export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const query = getQuery(event);

		const params = new URLSearchParams();
		if (query.statementable_type)
			params.append("statementable_type", String(query.statementable_type));
		if (query.statementable_id)
			params.append("statementable_id", String(query.statementable_id));
		if (query.year) params.append("year", String(query.year));
		if (query.per_page) params.append("per_page", String(query.per_page));
		if (query.order_by_column)
			params.append("order_by_column", String(query.order_by_column));
		if (query.order_by_direction)
			params.append("order_by_direction", String(query.order_by_direction));

		const url = `${apiBaseUrl}/financial-statements?${params.toString()}`;

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
			message: "Extratos carregados com sucesso",
			data: response,
		} as IResponse;
	} catch (err) {
		const error = err as IError;

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao carregar extratos",
			data: error,
		} as IResponse;
	}
});
