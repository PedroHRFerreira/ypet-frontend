export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/citizen/${id}`;
		const incoming = await readFormData(event);
		const outgoing = new FormData();

		// Copiar todos os campos não relacionados ao endereço
		for (const [key, value] of incoming.entries()) {
			if (!key.startsWith("address_")) {
				outgoing.append(key, value);
			}
		}

		outgoing.append("_method", "PUT");

		// Processar campos de endereço com prefixo address_
		const addressFields = [
			"zip_code",
			"street",
			"number",
			"complement",
			"district",
			"city",
			"state",
		];

		for (const field of addressFields) {
			const value = incoming.get(`address_${field}`);
			if (value !== null && value !== undefined && value !== "") {
				outgoing.append(`address[0][${field}]`, value as string);
			}
		}

		const response = await $fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"X-Client-Type": "web",
				Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			},
			body: outgoing,
		});

		return {
			type: "success",
			status: 200,
			message: "Atualizado com sucesso",
			show: false,
			data: response,
		} as IResponse;
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
