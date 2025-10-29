export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/citizen`;

		const incoming = await readFormData(event);

		const outgoing = new FormData();

		const appendIfExists = (k: string) => {
			const v = incoming.get(k);
			if (v !== null && v !== undefined && v !== "") {
				outgoing.append(k, v as any);
			}
		};

		const picture = incoming.get("picture");
		if (picture) outgoing.append("picture", picture as any);

		appendIfExists("name");
		appendIfExists("document");
		appendIfExists("password");
		appendIfExists("password_confirmation");
		appendIfExists("email");
		appendIfExists("gender");
		appendIfExists("birth_date");
		appendIfExists("telephone");
		appendIfExists("status");
		appendIfExists("special_permissions");
		appendIfExists("can_report_abuse");
		appendIfExists("can_mobile_castration");

		// Endereço: processar campos com prefixo address_
		const addressFields = [
			"zip_code",
			"street",
			"number",
			"complement",
			"district",
			"city",
			"state",
		];

		// Processar campos de endereço com prefixo address_
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
			message: "Cadastro realizado com sucesso",
			show: false,
			data: response,
		} as IResponse;
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) return error.data as IResponse;

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao armazenar citizen",
			show: true,
			data: error,
		} as IResponse;
	}
});
