export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/location`;

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

		appendIfExists("location_name");
		appendIfExists("location_type");
		appendIfExists("responsible_name");
		appendIfExists("phone");
		appendIfExists("email");
		appendIfExists("cnpj");
		appendIfExists("bank_account_or_pix");
		appendIfExists("status");
		appendIfExists("notes");

		// Processar campos de endereço com prefixo address_
		const addressJson = incoming.get("address");
		if (addressJson) {
			const addressArray = JSON.parse(addressJson as string);
			addressArray.forEach((addr, index) => {
				for (const [key, value] of Object.entries(addr)) {
					if (value) outgoing.append(`address[${index}][${key}]`, value);
				}
			});
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
			data: error,
		} as IResponse;
	}
});
