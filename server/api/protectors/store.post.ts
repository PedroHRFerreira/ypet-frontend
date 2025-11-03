import { apiPost } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/protector`;

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
		appendIfExists("can_report_abuse");
		appendIfExists("can_mobile_castration");
		appendIfExists("observations");
		appendIfExists("special_permissions");

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
